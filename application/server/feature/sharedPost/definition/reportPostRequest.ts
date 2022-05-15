export interface ReportPostRequestItem {
  id?: string | null;
  reportDetail?: string | null;
}

export interface ReportPostRequest {
  posts?: ReportPostRequestItem[] | null;
}
