import { API_VERSION, BASE_URL, URL_TYPE } from '@env';
import axios from 'axios';

const API_URL = `${BASE_URL}/${URL_TYPE}/${API_VERSION}/`;

export const endPoints = {
   //// Accounts
   // GET: Xem thông tin tài khoản đang đăng nhập
   me: '/accounts/me/',
   // PATCH: Cập nhật tài khoản đang đăng nhập
   'me-update': '/accounts/me/update/',
   // POST: Lấy access token đăng nhập
   token: '/o/token/',
   // POST: Đăng ký tài khoản cho sinh viên
   'student-register': '/accounts/students/register/',
   // POST: Đăng ký tài khoản cho trợ lý sinh viên
   'assistant-register': '/accounts/assistants/register/',
   // GET: Lấy danh sách tất cả trợ lý và chuyên viên sinh viên
   'all-user': '/all-users/',

   //// Students
   // GET: Lấy danh sách sinh viên
   students: '/students/',
   // GET: Lấy thông tin chi tiết của sinh viên
   'student-detail': (studentID) => `/students/${studentID}/`,
   // GET: Lấy danh sách học kỳ của sinh viên
   'student-semesters': (studentID) => `/students/${studentID}/semesters`,
   // GET: Lấy danh sách hoạt động của sinh viên
   'student-activities': (studentID) => `/students/${studentID}/activities/`,
   // GET: Thống kê điểm rèn luyện của sinh viên
   'student-points': (studentID, semesterCode) => `/students/${studentID}/points/${semesterCode}`,

   //// Assistant
   // GET: Lấy danh sách trợ lý sinh viên
   assistants: '/assistants/',
   // GET: Lấy thông tin chi tiết trợ lý sinh viên
   'assistant-detail': (assistantID) => `/assistants/${assistantID}/`,

   //// Activities
   /*
    * GET: /activities/ - Lấy danh sách hoạt động
    * GET: /activities/{activityID}/comments/ - Lấy danh sách bình luận của hoạt động
    * GET: /activities/{activityID}/ - Lấy thông tin chi tiết của hoạt động
    * POST: /activities/ - Tạo hoạt động mới
    * POST: /activities/{activityID}/comments/ - Thêm bình luận vào hoạt động
    * POST: /activities/{activityID}/like/ - Thích hoạt động
    * POST: /activities/{activityID}/register/ - Đăng ký hoạt động
    * POST: /activities/{activityID}/report/ - Báo thiếu hoạt động
    * PATCH: /activities/{activityID}/ - Cập nhật hoạt động
    * DELETE: /activities/{activityID}/ - Xóa hoạt động
    */
   activities: '/activities/', // GET, POST
   'activity-detail': (activityID) => `/activities/${activityID}/`, // GET, PATCH, DELETE
   'activity-comments': (activityID) => `/activities/${activityID}/comments/`, // GET, POST
   'activity-like': (activityID) => `/activities/${activityID}/like/`, // POST
   'activity-register': (activityID) => `/activities/${activityID}/register/`, // POST
   'activity-report': (activityID) => `/activities/${activityID}/report/`, // POST
   // POST: Upload file điểm danh
   attendance: '/activities/attendance/upload/csv/',

   //// Bulletins
   /*
    * GET: /bulletins/ - Lấy danh sách bản tin
    * GET: /bulletins/{bulletinID}/ - Lấy thông tin chi tiết của bản tin
    * POST: /bulletins/ - Tạo bản tin mới
    * POST: /bulletins/{bulletinID}/activites/{activityID}/ - Thêm hoạt động vào bản tin
    * PATCH: /bulletins/{bulletinID}/ - Cập nhật bản tin
    * DELETE: /bulletins/{bulletinID}/ - Xóa bản tin
    * DELETE: /bulletins/{bulletinID}/activites/{activityID}/ - Xóa hoạt động khỏi bản tin
    */
   bulletins: '/bulletins/', // GET, POST
   'bulletin-detail': (bulletinID) => `/bulletins/${bulletinID}/`, // GET, PATCH, DELETE
   'bulletin-activity': (bulletinID) => `/bulletins/${bulletinID}/activites/`, // POST, DELETE

   //// Missing Reports
   // GET: Lấy danh sách báo thiếu
   reports: '/reports/',
   // GET: Lấy thông tin chi tiết của báo thiếu
   'report-detail': (reportID) => `/reports/${reportID}/`,
   // POST: Xác nhận báo thiếu
   'confirm-report': (reportID) => `/reports/${reportID}/confirm/`,
   // DELETE: Từ chối báo thiếu
   'reject-report': (reportID) => `/reports/${reportID}/reject/`,

   //// Comments
   /*
    * PUT: Cập nhật bình luận
    * DELETE: Xóa bình luận
    */
   'comment-detail': (commentID) => `/comments/${commentID}/`, // PUT, DELETE

   //// Schools
   // GET: Lấy danh sách lớp (có thể lọc theo khoa)
   classes: '/classes/',
   //GET: Lấy danh sách khoa
   faculty: '/faculty/',
   // GET: Lấy danh sách học kỳ
   semesters: '/semesters/',
   // GET: Lấy danh sách quy chế điểm rèn luyện
   criterions: '/criterions/',

   //// Statistics
   // GET: Thống kê theo khoa hoặc lớp hoặc cả 2
   'statistics-points': (semesterCode) => `/statistics/${semesterCode}/points/`,
   // GET: Xuất file thống kê dạng pdf hoặc csv
   'export-statistics': (semesterCode) => `/statistics/${semesterCode}/export/`,
};

export const authAPI = (token) => {
   return axios.create({
      baseURL: API_URL,
      headers: {
         Authorization: `Bearer ${token}`,
         'Content-Type': 'multipart/form-data',
      },
   });
};

export default axios.create({
   baseURL: API_URL,
   headers: {
      'Content-Type': 'multipart/form-data',
   },
});
