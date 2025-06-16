from openai import OpenAI
from demo_novel_game.llm_settings.prompts import system_prompt_created
from demo_novel_game.llm_settings.schema import schema_dict_created



def scenario_craeted(
  user_input: str = "",
  current_group_id: str = "",
  prompt_add_info_dict: dict = {},
  scenario_log_list: list = [],
  ):
    openai_key="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"
    client = OpenAI(api_key=openai_key)

    schema = schema_dict_created()
    system_prompt = system_prompt_created(
      current_group_id,
      prompt_add_info_dict,
      scenario_log_list,
    )
    response = client.chat.completions.create(
        model="gpt-4o-2024-08-06",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_input}
        ],
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "chapter_output",
                "strict": True,
                "schema": schema
            }
        }
    )

    print(response.choices[0].message.content)

    return response.choices[0].message.content

