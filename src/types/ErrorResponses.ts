export type MultiFactorCreateError = {
  errors: [
    {
      code: "TwoFactorAuthenticationTokenInvalid";
      status: "400";
      detail: "The token provided is not valid.";
    }
  ];
};

export type MultiFactorDisableError = {
  errors: [
    {
      code: "BadRequestHttpException";
      status: "400";
      detail: "An error was encountered while processing this request.";
    }
  ];
};

export type InvalidEmailAddress = {
  errors: [
    {
      code: "email";
      detail: "The email must be a valid email address.";
      source: {
        field: "email";
      };
    }
  ];
};

export type InvalidPassword = {
  errors: [
    {
      code: "InvalidPasswordProvidedException";
      status: "400";
      detail: "The password provided was invalid for this account.";
    }
  ];
};

export type UnknownApiKey = {
  errors: [
    {
      code: "NotFoundHttpException";
      status: "404";
      detail: "An error was encountered while processing this request.";
    }
  ];
};

export type ServerOffline = {
  errors: [
    {
      code: "HttpException";
      status: "502";
      detail: "An error was encountered while processing this request.";
    }
  ];
};

export type DeletePrimaryAllocation = {
  errors: [
    {
      code: "DisplayException";
      status: "400";
      detail: "Cannot delete the primary allocation for a server.";
    }
  ];
};
