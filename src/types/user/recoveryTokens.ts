export interface RawRecoveryTokens {
  object: "recovery_tokens";
  attributes: RecoveryTokensAttributes;
}

export interface RecoveryTokensAttributes {
  tokens: [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
  ];
}
