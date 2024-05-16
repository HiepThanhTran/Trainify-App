import axios from 'axios';

const BASE_URL = 'https://trainingpoint.vercel.app';
const TYPE = 'api';
const VERSION = 'v1';
const API_URL = `${BASE_URL}/${TYPE}/${VERSION}/`;

export const endpoints = {
    //// Accounts
    me: '/accounts/me/', // GET: Xem thông tin tài khoản đang đăng nhập
    login: 'acconuts/auth/login/', // POST: Đăng nhập
    studentRegister: 'accounts/auth/student/register/', // POST: Đăng ký tài khoản cho sinh viên
    assistantRegister: 'accounts/auth/assistant/register/', // POST: Đăng ký tài khoản cho trợ lý sinh viên
    meUpdate: '/accounts/me/update/', // PATCH: Cập nhật tài khoản đang đăng nhập

    //// Students
    students: '/students/', // GET: Lấy danh sách sinh viên
    studentDetails: (studentID) => `/students/${studentID}/`, // GET: Lấy thông tin chi tiết của sinh viên
    studentActivities: (studentID) => `/students/${studentID}/activities/`, // GET: Lấy danh sách hoạt động của sinh viên
    studentReports: (studentID) => `/students/${studentID}/reports/`, // GET: Lấy danh sách hoạt động sinh viên báo thiếu
    studentPoints: (studentID, semesterCode) => `/students${studentID}/points/${semesterCode}`, // GET: Thống kê điểm rèn luyện của sinh viên

    //// Assistant
    assistants: '/assistants/', // GET: Lấy danh sách trợ lý sinh viên
    assistantDetails: (assistantID) => `/assistants/${assistantID}/`, // GET: Lấy thông tin chi tiết trợ lý sinh viên

    //// Bulletins
    /*
    * Bản tin là nơi chứa các hoạt động, sinh viên có thể xem và tham gia hoạt động
    * GET: /bulletins/ - Lấy danh sách bản tin (có thể lọc theo tiêu đề bản tin)
    * GET: /bulletins/{bulletinID}/ - Lấy thông tin chi tiết của bản tin
    * POST: /bulletins/ - Tạo bản tin mới
    * POST: /bulletins/{bulletinID}/activites/{activityID}/ - Thêm hoạt động vào bản tin
    * PATCH: /bulletins/{bulletinID}/ - Cập nhật bản tin
    * DELETE: /bulletins/{bulletinID}/ - Xóa bản tin
    * DELETE: /bulletins/{bulletinID}/activites/{activityID}/ - Xóa hoạt động khỏi bản tin
     */
    bulletins: '/bulletins/', // GET, POST
    bulletinDetails: (bulletinID) => `/bulletins/${bulletinID}/`, // GET, PATCH, DELETE
    activityOfBulletin: (bulletinID, activityID) => `/bulletins/${bulletinID}/activites/${activityID}/`, // POST, DELETE

    //// Activities
    /*
    * Hoạt động là nơi sinh viên có thể đăng ký, xem và tham gia bình luận
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
    activityDetails: (activityID) => `/activities/${activityID}/`, // GET, PATCH, DELETE
    activityComments: (activityID) => `/activities/${activityID}/comments/`, // GET, POST
    activityLike: (activityID) => `/activities/${activityID}/like/`, // POST
    activityRegister: (activityID) => `/activities/${activityID}/register/`, // POST
    activityReport: (activityID) => `/activities/${activityID}/report/`, // POST

    //// Reports
    reports: '/reports/', // GET: Lấy danh sách báo thiếu
    reportDetails: (reportID) => `/reports/${reportID}/`, // GET: Lấy thông tin chi tiết của báo thiếu
    confirmReport: (reportID) => `/reports/${reportID}/confirm/`, // POST: Xác nhận báo thiếu
    rejectReport: (reportID) => `/reports/${reportID}/reject/`, // POST: Từ chối báo thiếu

    //// Comments
    // PUT: Cập nhật bình luận
    // DELETE: Xóa bình luận
    commentDetails: (commentID) => `/comments/${commentID}/`, // PUT, DELETE

    //// Semesters
    semesters: '/semesters/', // GET: Lấy danh sách học kỳ

    //// Criterions
    criterions: '/criterions/', // GET: Lấy danh sách quy chế điểm rèn luyện

    //// Statistics
    statisticsSchools: '/statistics/school/', // GET: Thống kê toàn trường
    statisticsFilter: (semesterCode) => `/statistics/points/${semesterCode}/`, // GET: Thống kê theo khoa hoặc lớp hoặc cả 2

    //// Files
    attendanceUpload: '/files/attendance/upload/csv/', // POST: Upload file điểm danh
};

export default axios.create({baseURL: API_URL});
