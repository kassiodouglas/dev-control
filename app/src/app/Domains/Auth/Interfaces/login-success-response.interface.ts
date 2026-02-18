import { iApiResponse } from "@src/app/Core/Interfaces/api-response.interface";

export interface iLoginSuccessResponse
  extends iApiResponse<iLoginData> { }

export interface iUser {
  uuid: string;
  name: string;
  email: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
}

export interface iLoginData {
  access_token: string;
  token_type: string;
  user: iUser;
}
