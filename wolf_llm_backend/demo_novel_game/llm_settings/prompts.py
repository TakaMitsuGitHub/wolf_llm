import json
import os
from openai import OpenAI

# --- Prompt generation functions ---

def explanation_str_created():
    explanation_str = f"""
## Explanation
- `ScenarioLog`は過去のシナリオを時系列で昇順に並べたものです。
- `LLMSelectableChoices`はあなたが作成するシナリオの次のシーンの候補です。
- `LLMSelectableChoices`の"NextChapterRequirementFlags"は次のシーンで必要となるフラグです。
- `CurrentFlags`は現在のフラグです。
- `AvailableBackgroundImages`の"BackgroundImage"は使用可能な背景画像で"BackgroundImageOverview"はその画像の概要です。

"""
    return explanation_str

def current_flags_str_created(prompt_add_info_dict):
    current_flags_dict = prompt_add_info_dict.get("CurrentFlags", {})
    current_flags_str = "### CurrentFlags\n"
    current_flags_str += f"{str(current_flags_dict)}\n"
    current_flags_str += "\n"
    return current_flags_str


def scenario_log_str_created(scenario_log_list):
    # 最新から遡って最大10件
    recent_logs = scenario_log_list[-10:]  # 後ろから10件（末尾が最新）
    scenario_log_str = "## ScenarioLog\n"
    for i, step_dict in enumerate(recent_logs):
        scenario_log_str += f"{i}. {str(step_dict)}\n"
    scenario_log_str += "\n"
    return scenario_log_str


def llm_selectable_choices_str_created(prompt_add_info_dict):
    llm_selectable_choices_list = prompt_add_info_dict.get("LLMSelectableChoices", [])
    llm_selectable_choices_str = "## LLMSelectableChoices（以下の選択肢から1つだけ選んで使用）\n"

    base_path = os.path.join("demo_novel_game", "data", "chapters")

    for i, choice_dict in enumerate(llm_selectable_choices_list, 1):
        next_group = choice_dict.get("NextGroupId")
        next_chapter = next_group.split("---")[0]
        chapter_file = os.path.join(base_path, f"{next_chapter}.json")
        try:
            with open(chapter_file, encoding="utf-8") as f:
                chapter_data = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            # ファイルが無い・読み込めない場合はスキップ
            continue

        # Groups はリストなので、まずは該当の group を検索
        groups = chapter_data.get("Groups", [])
        target = next(
            (g for g in groups if g.get("GroupId") == next_group),
            None
        )

        # 安全に Steps を取得
        next_steps = target.get("Steps", []) if isinstance(target, dict) else []
        if not next_steps:
            print("next_stepsが空です")
        choice_dict["NextSteps"] = next_steps
        llm_selectable_choices_str += f"{i}. {str(choice_dict)}\n"

    llm_selectable_choices_str += "\n"
    return llm_selectable_choices_str

def active_characters_str_created(prompt_add_info_dict):
    active_characters_list = prompt_add_info_dict.get("ActiveCharacters", [])
    active_characters_str = "### ActiveCharacters\n"
    for active_character in active_characters_list:
        active_characters_str += f"- {active_character}\n"
    active_characters_str += "\n"
    return active_characters_str


def available_characters_str_created(prompt_add_info_dict):
    available_characters_list = prompt_add_info_dict.get("AvailableCharacters", [])
    available_characters_str = "### AvailableCharacters\n"
    for available_character in available_characters_list:
        available_characters_str += f"- {available_character}\n"
    available_characters_str += "\n"
    return available_characters_str


def scene_status_str_created(prompt_add_info_dict):
    scene_status = prompt_add_info_dict.get("SceneStatus", "")
    scene_status_str = "### SceneStatus\n"
    scene_status_str += f"- {scene_status}\n"
    scene_status_str += "\n"
    return scene_status_str


def available_background_images_str_created(prompt_add_info_dict):
    available_background_images_dict = prompt_add_info_dict.get("AvailableBackgroundImages", {})
    available_background_images_str = "### AvailableBackgroundImages\n"
    available_background_images_str += f"{str(available_background_images_dict)}\n"
    available_background_images_str += "\n"
    return available_background_images_str


def perspective_action_str_created(user_input, prompt_add_info_dict):
    perspective = prompt_add_info_dict.get("Perspective", "キャラクター")
    perspective_action_str = "### PerspectiveAction\n"
    perspective_action_str += f'{{"Perspective": "{perspective}","Action": "{user_input}"}}\n'
    perspective_action_str += "\n"
    return perspective_action_str


def scenario_creation_conditions_str_created():
    scenario_creation_conditions_str = f"""### ScenarioCreationConditions
- 作成するシナリオは`ScenarioLog`と`SceneStatus`の状況から`PerspectiveAction`が行われた場合のシナリオでなければなりません。
- `PerspectiveAction`の"Action"が抽象的な場合でも"Perspective"と`ScenarioLog`から"なぜそうしたか"を推察し、"Action"に合ったシナリオにしなければなりません。
- 作成するシナリオは`LLMSelectableChoices`のどれかを選択し、その内容に繋がるように、尚且つ矛盾しないように構成しなければなりません。
- 選択した`LLMSelectableChoices`の"NextSteps"の内容は作成するシナリオに含めてはいけません。
- 作成するシナリオでは"narration"で`PerspectiveAction`の結果を表さなくてなりません。
- 作成するシナリオのstep数は10以下でなくてはなりません。

"""
    return scenario_creation_conditions_str


def instruction_str_created():
    instruction_str = f"""## Instruction
- `ScenarioCreationConditions`の条件を全て満たしたシナリオを作成しなさい。
- `OutputSpec`の内容を厳密に守りなさい。

"""
    return instruction_str

def output_spec_str_created(current_group_id):
    output_spec_str = f"""## OutputSpec
- 出力の"ChangeFlags"は必ずシナリオ作成で選択した`LLMSelectableChoices`の"NextChapterRequirementFlags"に合わせて変更しなければなりません。
- 出力の"NextGroupId"は必ずシナリオ作成で選択した`LLMSelectableChoices`の"NextGroupId"にしなければなりません。
- 出力の"GroupId"は"{current_group_id}"にしなければなりません。

"""
    return output_spec_str

def rewards_str_created():
    rewards_str = f"""## Rewards
- より高い精度の出力をすることにより報酬が発生します。

"""
    return rewards_str


def system_prompt_created():
    system_prompt = f""""あなたはビジュアルノベルゲームのシナリオ作家です。\n"
"- ユーザーの入力が曖昧な場合でも、ScenarioLog や状況から適切な解釈を行い、自然なストーリーとして展開してください。\n"
"""
    return system_prompt

def user_prompt_created(
        prompt_add_info_dict,
        scenario_log_list,
        user_input,
        current_group_id
):
    user_prompt = (
        # explanation_str_created() +
        current_flags_str_created(prompt_add_info_dict) +
        scenario_log_str_created(scenario_log_list) +
        perspective_action_str_created(user_input, prompt_add_info_dict) +
        active_characters_str_created(prompt_add_info_dict) +
        available_characters_str_created(prompt_add_info_dict) +
        scene_status_str_created(prompt_add_info_dict) +
        llm_selectable_choices_str_created(prompt_add_info_dict) +
        available_background_images_str_created(prompt_add_info_dict) +
        scenario_creation_conditions_str_created() +
        instruction_str_created() +
        output_spec_str_created(current_group_id) +
        rewards_str_created()
    )
    return user_prompt