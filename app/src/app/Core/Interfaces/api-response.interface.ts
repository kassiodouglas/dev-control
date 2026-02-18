export interface iApiResponse<T = any> {
  status: string;
  message: string;
  data?: T;
  errors?:any;
}

export interface iApiErrorResponse {
  error: iApiResponse;
  message: string;
  status:number;
  statusText:string;
  url:string;
}
