import { CommonParams } from "./common";

export interface BookType {
  id_sach: string;
  id_tacgia: string;
  ten: string;
  nxb: string;
  anh: string;
  mieuta: string;
  language: string;
  ngayxuatban: string;
  ngaytao: string;
  isbn: string;
  page_count: number;
  dexuat: boolean;
}

export interface GetBookParams extends CommonParams {
  f_name?: string;
}

export interface PostBookRequest {
  id?: string;
  title: string;
  name: string;
  image: string;
  status: string;
}
