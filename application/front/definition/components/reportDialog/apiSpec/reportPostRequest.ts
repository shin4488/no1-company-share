export interface ReportPostRequestItem {
  id: string;
  reportDetail: string;
}

export interface ReportPostRequest {
  posts: ReportPostRequestItem[];
}
