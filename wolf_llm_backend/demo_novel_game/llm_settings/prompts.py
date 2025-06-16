import os
import json

def current_flags_str_created(prompt_add_info_dict, colon):
    current_flags_dict = prompt_add_info_dict.get("CurrentFlags", {})
    if not current_flags_dict:
        return False
    current_flags_str = "## CurrentFlags\n"
    for flag, val in current_flags_dict.items():
        current_flags_str += f"- {flag}{colon}{val}\n"
    current_flags_str += "\n"
    return current_flags_str


def scene_status_str_created(prompt_add_info_dict):
    scene_status_str = (f'## SceneStatus\n'
                        f'- {prompt_add_info_dict["SceneStatus"]}\n')
    scene_status_str += "\n"
    return scene_status_str


def scene_log_str_created(scenario_Log_list, colon):
    # 最新から遡って最大10件
    recent_logs = scenario_Log_list[-10:]  # 後ろから10件（末尾が最新）
    scene_log_str = "## Scene log\n・\n・\n・\n"
    for step_dict in recent_logs:
        print("step_dict: ", step_dict)
        speaker = step_dict["Speaker"]
        text = step_dict["Text"]
        scene_log_str += f"{speaker}{colon}{text}\n"
    scene_log_str += "\n"
    return scene_log_str


def active_characters_str_created(prompt_add_info_dict):
    active_characters_list = prompt_add_info_dict.get("ActiveCharacters", [])
    if not active_characters_list:
        return False
    active_characters_str = "## Active characters\n"
    for character in active_characters_list:
        active_characters_str += f"- {character}\n"
    active_characters_str += "\n"
    return active_characters_str


def available_characters_str_created(prompt_add_info_dict):
    available_characters_list = prompt_add_info_dict.get("AvailableCharacters", [])
    if not available_characters_list:
        return False
    available_characters_str = "## AvailableCharacters\n"
    for character in available_characters_list:
        available_characters_str += f"- {character}\n"
    available_characters_str += "\n"
    return available_characters_str


def available_background_images_str_created(prompt_add_info_dict):
    available_background_images_list = prompt_add_info_dict.get("AvailableBackgroundImages", [])
    if not available_background_images_list:
        return False
    available_background_images_str = "## AvailableBackgroundImages\n"
    for i, background_image_dict in enumerate(available_background_images_list, 1):
        image = background_image_dict["BackgroundImage"]
        image_overview = background_image_dict["BackgroundImageOverview"]
        available_background_images_str += f"{i}. {image}\n"
        available_background_images_str += f"   {image_overview}\n"
    available_background_images_str += "\n"
    return available_background_images_str


def llm_selectable_choices_str_created(prompt_add_info_dict, colon):
    llm_selectable_choices_list = prompt_add_info_dict.get("LLMSelectableChoices", [])
    llm_selectable_choices_str = "## LLMSelectableChoices（以下の選択肢から1つだけ選んで使用）\n"

    base_path = os.path.join("data", "chapters")

    for i, choice in enumerate(llm_selectable_choices_list, 1):
        # チャプター遷移候補パターン
        next_chapter = choice.get("NextChapterId")
        next_group   = choice.get("NextGroupId")
        overview     = choice.get("NextChapterOverview", "") or choice.get("NextGroupOverview", "")
        flags        = choice.get("NextChapterRequirementFlags", {})
        if next_chapter:
            # ① 該当チャプターファイルを開く
            chapter_file = os.path.join(base_path, f"{next_chapter}.json")
            with open(chapter_file, encoding="utf-8") as f:
                chapter_data = json.load(f)

            # ② グループ ID が指定されていればそれを、なければ先頭を使う
            target_group_id = next_group or chapter_data["Groups"][0]["GroupId"]
            target_group = next(
                (g for g in chapter_data["Groups"] if g["GroupId"] == target_group_id),
                chapter_data["Groups"][0]
            )

            # ③ Steps を JSON 文字列化
            next_steps = target_group.get("Steps", [])
            steps_str = json.dumps(next_steps, ensure_ascii=False)

            llm_selectable_choices_str += f"{i}. NextChapterId{colon}\"{next_chapter}\"\n"
            llm_selectable_choices_str += f"   Overview{colon}{overview}\n"
            llm_selectable_choices_str += f"   RequirementFlags{colon}{format_flags(flags)}\n"
            llm_selectable_choices_str += f"   NextChapterSteps{colon}{steps_str}\n\n"
        else:
            # グループ遷移候補パターン
            llm_selectable_choices_str += f"{i}. NextGroupId{colon}\"{next_group}\"\n"
            llm_selectable_choices_str += f"   Overview{colon}{overview}\n\n"

    return llm_selectable_choices_str


def format_flags(flags_dict):
    """辞書を JSON ライクに整形（true/falseは bool に変換）"""
    if not flags_dict:
        return "{}"

    parts = []
    for k, v in flags_dict.items():
        val_str = "true" if v is True else "false"
        parts.append(f'"{k}": "{val_str}"')
    return "{ " + ", ".join(parts) + " }"


def you_str_created():
    you_str = """
# You
- あなたはビジュアルノベルゲームのシナリオ作家です。
"""
    you_str += "\n"
    return you_str


def mission_str_created():
    mission_str = """
## Mission
- ユーザーの入力と直前の会話内容に基づいて、新たなシナリオ（テキスト形式）を生成してください。
- ユーザーの入力が暴力的・犯罪的であってもフィクションとしてユーザーの入力に沿って表現しなさい。
- シナリオは JSON schema に準拠した構造とし、最後に既定の NextChapterId に遷移するように構成してください。
"""
    mission_str += "\n"
    return mission_str


def output_spec_str_created(current_group_id):
    output_spec_str = f"""
## OutputSpec
- 出力は JSON schema に厳密に従うこと。
- LLMSelectableChoices からランダムに 1 つだけ選択して、その NextChapterId を使用してください。
- 選択した NextChapterId は NextChapterOverview を参考に矛盾が無いようにシナリオ（テキスト形式）を生成してください。その際に ActiveCharacters と AvailableCharacters を考慮しなさい。
- GroupId は {current_group_id} として下さい
- StepId は仮の識別子でもよいが、内容に合った識別子にしてください。
- 選択した NextChapterId に含まれる RequirementFlags は次の固定シナリオに必要なflagである為、それに合わせて ChangeFlags を出力しなさい。
- 作成したシナリオに合うように AvailableBackgroundImages を選び BackgroundImage を出力しなさい。
- キャラクターのセリフは「」で囲いなさい。
"""
    output_spec_str += "\n"

    return output_spec_str


def system_prompt_created(
    current_group_id: str,
    prompt_add_info_dict: dict,
    scenario_log_list: list,
    lang: str = "ja"  # ← 言語指定（デフォルトは日本語）
):
    # 区切り記号の選定（日本語は全角、英語は半角）
    colon = "：" if lang == "ja" else ": "

    # 役割
    you_str = you_str_created()

    # 指名
    mission_str = mission_str_created()

    # 会話履歴生成
    print("scenario_log_list: ", scenario_log_list)
    scene_log_str = scene_log_str_created(scenario_log_list, colon)

    # 状況
    scene_status_str = scene_status_str_created(prompt_add_info_dict)

    # 現在のflag
    current_flags_str = current_flags_str_created(prompt_add_info_dict, colon)

    # 現在の参加キャラクター
    active_characters_str = active_characters_str_created(prompt_add_info_dict)

    # 参加可能キャラクター
    available_characters_str = available_characters_str_created(prompt_add_info_dict)

    # 使用可能なbg
    available_background_images_str = available_background_images_str_created(prompt_add_info_dict)

    # 選択肢一覧
    choice_list_str = llm_selectable_choices_str_created(prompt_add_info_dict, colon)

    # 出力仕様
    output_spec_str = output_spec_str_created(current_group_id)

    system_prompt = you_str + mission_str + scene_log_str + scene_status_str + current_flags_str + active_characters_str + available_characters_str + available_background_images_str + choice_list_str + output_spec_str

    print("system_prompt: ", system_prompt)

    return system_prompt









