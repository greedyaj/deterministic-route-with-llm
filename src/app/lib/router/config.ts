export const ROUTER_MAX_TOOLS = 20;
export const ROUTER_MIN_SCORE = 0.25;
export const ROUTER_MATCH_STRATEGY = "lexical" as const;

export const ROUTER_SCORE_WEIGHTS = {
  token: 0.4,
  phrase: 0.3,
  tag: 0.2,
  example: 0.1,
} as const;

export const ROUTER_NORMALIZATION_RULES = {
  caseFold: "lowercase",
  trim: true,
  collapseWhitespace: true,
} as const;

export const ROUTER_TIE_BREAKERS = [
  "score_desc",
  "tag_match_desc",
  "name_asc",
] as const;
