export interface RawSignedUrl {
  object: 'signed_url';
  attributes: SignedUrlAttributes;
}

export interface SignedUrlAttributes {
  url: string;
}
