from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import os
import json
from uuid import uuid4
import traceback

from demo_novel_game.scenario.scenario_llm import scenario_craeted

class ChapterGroupView(APIView):
    def post(self, request):

        print(f"request : {request}")
        # chapter_id = request.data.get("ChapterId")
        group_id = request.data.get("GroupId")
        chapter_id = group_id.split("---")[0]

        print(f"【API呼び出し】chapter: {chapter_id}, group: {group_id}")

        base_path = os.path.join("demo_novel_game", "data", "chapters")
        file_path = os.path.join(base_path, f"{chapter_id}.json")

        try:
            with open(file_path, "r", encoding="utf-8") as f:
                chapter_data = json.load(f)
            print(f"✔ チャプターデータ読み込み成功: {file_path}")

            matching_group = next(
                (group for group in chapter_data["Groups"] if group["GroupId"] == group_id),
                None
            )

            if not matching_group:
                print(f"❌ グループが見つからない: GroupId={group_id}")
                return Response(
                    {"error": "グループが見つかりません"},
                    status=status.HTTP_404_NOT_FOUND
                )

            return Response({
                "ChapterId": chapter_id,
                "GroupId": group_id,
                "Type": matching_group["Type"],
                "Steps": matching_group.get("Steps", []),
                "Choices": matching_group.get("Choices", []),
                "Next": matching_group.get("Next", {})
            })

        except FileNotFoundError:
            print(f"❌ ファイルが存在しない: {file_path}")
            return Response({"error": "チャプターが見つかりません"}, status=404)
        except Exception as e:
            print("⚠ 予期せぬエラー:", str(e))
            traceback.print_exc()  # ← これを追加
            return Response({"error": str(e)}, status=500)


class LLMGenerateGroupView(APIView):
    def post(self, request):
        input_text = request.data.get("InputText")
        next_group_id = request.data.get("NextGroupId")
        prompt_add_info = request.data.get("PromptAddInfo", {})
        log_list = request.data.get("Log", [])

        if not input_text:
            return Response({"error": "InputText is required"}, status=400)
        if not next_group_id:
            return Response({"error": "NextGroupId is required"}, status=400)

        print(f"自由入力受信: {input_text}")
        print(f"→ 次のgroup_id: {next_group_id}")

        try:
            result_json = scenario_craeted(
                user_input=input_text,
                current_group_id=next_group_id,
                prompt_add_info_dict=prompt_add_info,
                scenario_log_list=log_list,
            )

            # JSON文字列として受け取ったものを辞書に変換して返す
            result_dict = json.loads(result_json)

            return Response(result_dict)

        except Exception as e:
            print(f"⚠ LLM生成エラー: {str(e)}")
            traceback.print_exc()
            return Response({"error": str(e)}, status=500)