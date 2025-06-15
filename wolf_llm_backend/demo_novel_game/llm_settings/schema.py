def schema_dict_created():
    schema_dict = {
        "type": "object",
        "properties": {
            "GroupId": {"type": "string"},
            "Type": {"type": "string", "enum": ["text"]},
            "ChangeFlags": {
                "type": "object",
                "properties": {},
                "additionalProperties": {"type": "string"}
            },
            "Next": {
                "type": "object",
                "properties": {
                    "NextGroupId": {"type": "string"},
                },
                "required": ["NextGroupId"],
                "additionalProperties": False
            },
            "Steps": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "StepId": {"type": "string"},
                        "Speaker": {"type": "string"},
                        "Text": {"type": "string"},
                        "BackgroundImage": {"type": "string"}
                    },
                    "required": ["StepId", "Speaker", "Text", "BackgroundImage"],
                    "additionalProperties": False
                }
            }
        },
        "required": ["GroupId", "Type", "ChangeFlags", "Next", "Steps"],
        "additionalProperties": False
    }

    return schema_dict
