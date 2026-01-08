# Tool Metadata Rules (Design)

## Purpose
Define consistent authoring rules for tags, keywords, and examples so routing stays deterministic and predictable.

## Tags
- Use 2-4 tags per tool.
- Always include domain and operation tags (e.g., `calendar`, `create`).
- Use singular nouns for entities (e.g., `event`, `invoice`).
- Avoid synonyms in tags; use keywords for that.

## Keywords
- Use 4-8 keywords per tool.
- Include common action verbs and user phrasing.
- Keep keywords lowercase, single words or short phrases.
- Avoid duplicating tags as keywords unless they are common user words.

## Examples
- Provide 3-5 short, realistic user utterances per tool.
- Keep examples under 8-10 words.
- Avoid punctuation unless natural (e.g., question marks).
- Each example should include the action and the entity.

## Naming
- Tool `name` should be stable and predictable: `<domain>.<operation>_<entity>`.
- Tool `id` should match `name` for the POC.

## Parameter Schemas
- Keep parameters minimal and descriptive.
- Use `payload` for generic inputs, and `id` for fetch/delete.
- Set `additionalProperties: false` for determinism.
