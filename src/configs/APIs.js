import { API_VERSION, BASE_URL, URL_TYPE } from '@env';
import axios from 'axios';

const API_URL = `${BASE_URL}/${URL_TYPE}/${API_VERSION}/`;

export const endPoints = {
   //// Accounts
   me: '/accounts/me/', // GET: Xem thông tin tài khoản đang đăng nhập
   'me-update': '/accounts/me/update/', // PATCH: Cập nhật tài khoản đang đăng nhập
   token: '/o/token/', // POST: Lấy access token đăng nhập
   'student-register': '/accounts/students/register/', // POST: Đăng ký tài khoản cho sinh viên
   'assistant-register': '/accounts/assistants/register/', // POST: Đăng ký tài khoản cho trợ lý sinh viên

   //// Students
   students: '/students/', // GET: Lấy danh sách sinh viên
   'student-detail': (studentID) => `/students/${studentID}/`, // GET: Lấy thông tin chi tiết của sinh viên
   'student-semesters': (studentID) => `/students/${studentID}/semesters`,
   'student-activities': (studentID) => `/students/${studentID}/activities/`, // GET: Lấy danh sách hoạt động của sinh viên
   'student-points': (studentID, semesterCode) => `/students/${studentID}/points/${semesterCode}`, // GET: Thống kê điểm rèn luyện của sinh viên

   //// Assistant
   assistants: '/assistants/', // GET: Lấy danh sách trợ lý sinh viên
   'assistant-detail': (assistantID) => `/assistants/${assistantID}/`, // GET: Lấy thông tin chi tiết trợ lý sinh viên

   //// Activities
   /*
    * GET: /activities/ - Lấy danh sách hoạt động (có thể lọc theo tên, bản tin, khoa, học kỳ, tiêu chí, hình thức, ngày bắt đầu, ngày kết thúc)
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
   attendance: '/activities/attendance/upload/csv/', // POST: Upload file điểm danh

   //// Bulletins
   /*
    * GET: /bulletins/ - Lấy danh sách bản tin (có thể lọc theo tiêu đề bản tin)
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
   reports: '/reports/', // GET: Lấy danh sách báo thiếu (có thể lọc theo sinh viên, hoạt động, khoa)
   'report-detail': (reportID) => `/reports/${reportID}/`, // GET: Lấy thông tin chi tiết của báo thiếu
   'confirm-report': (reportID) => `/reports/${reportID}/confirm/`, // POST: Xác nhận báo thiếu
   'reject-report': (reportID) => `/reports/${reportID}/reject/`, // POST: Từ chối báo thiếu

   //// Comments
   /*
    * PUT: Cập nhật bình luận
    * DELETE: Xóa bình luận
    */
   'comment-detail': (commentID) => `/comments/${commentID}/`, // PUT, DELETE

   //// Schools
   classes: '/classes/', // GET: Lấy danh sách lớp (có thể lọc theo khoa)
   semesters: '/semesters/', // GET: Lấy danh sách học kỳ
   criterions: '/criterions/', // GET: Lấy danh sách quy chế điểm rèn luyện

   //// Statistics
   'statistics-points': (semesterCode) => `/statistics/${semesterCode}/points/`, // GET: Thống kê theo khoa hoặc lớp hoặc cả 2
   'export-statistics': (semesterCode) => `/statistics/${semesterCode}/export/`, // GET: Xuất file thống kê dạng pdf hoặc csv

   //Faculty
   'faculty': '/faculty/', //GET: Lấy danh sách khoa
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
