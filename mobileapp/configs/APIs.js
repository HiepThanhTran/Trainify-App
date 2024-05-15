import axios from 'axios';

const BASE_URL = 'https://trainingpoint.vercel.app';
const TYPE = 'api'
const VERSION = 'v1'
const API_URL = `${BASE_URL}/${TYPE}/${VERSION}/`

export const endpoints = {
    // Accounts
    me: '/accounts/me/', // GET: Xem thông tin tài khoản đang đăng nhập
    login: 'acconuts/auth/login/', // POST: Đăng nhập
    studentRegister: 'accounts/auth/student/register/', // POST: Đăng ký tài khoản cho sinh viên
    assistantRegister: 'accounts/auth/assistant/register/', // POST: Đăng ký tài khoản cho trợ lý sinh viên
    meUpdate: '/accounts/me/update/', // PATCH: Cập nhật tài khoản đang đăng nhập

    // Students
    students: '/students/', // GET: Lấy danh sách sinh viên
    studentDetails: (studentID) => `/students/${studentID}/`, // GET: Lấy thông tin chi tiết của sinh viên
    studentActivities: (studentID) => `/students/${studentID}/activities/`, // GET: Lấy danh sách hoạt động của sinh viên
    studentReports: (studentID) => `/students/${studentID}/reports/`, // GET: Lấy danh sách hoạt động sinh viên báo thiếu
    studentPoints: (studentID, semesterCode) => `/students${studentID}/points/${semesterCode}`, // GET: Thống kê điểm rèn luyện của sinh viên

    // Assistant
    assistants: '/assistants/', // GET: Lấy danh sách trợ lý sinh viên
    assistantDetails: (assistantID) => `/assistants/${assistantID}/`, // GET: Lấy thông tin chi tiết trợ lý sinh viên

    // Bulletins
    // GET: Lấy danh sách bản tin
    // POST: Tạo bản tin mới
    bulletins: '/bulletins/', // GET, POST
    // GET: Lấy thông tin chi tiết của bản tin
    // PATCH: Cập nhật bản tin
    // DELETE: Xóa bản tin
    bulletinDetails: (bulletinID) => `/bulletins/${bulletinID}/`, // GET, PATCH, DELETE
    bulletinActivities: (bulletinID) => `/bulletins/${bulletinID}/activities/`, // GET: Lấy danh sách hoạt động của bản tin
    // POST: Thêm hoạt động vào bản tin
    // DELETE: Xóa hoạt động khỏi bản tin
    activityOfBulletin: (bulletinID, activityID) => `/bulletins/${bulletinID}/activites/${activityID}/`, // POST, DELETE

    // Activities
    // GET: Lấy danh sách hoạt động
    // POST: Tạo hoạt động mới
    activities: '/activities/', // GET, POST
    // GET: Lấy thông tin chi tiết của hoạt động
    // PATCH: Cập nhật hoạt động
    // DELETE: Xóa hoạt động
    activityDetails: (activityID) => `/activities/${activityID}/`, // GET, PATCH, DELETE
    // GET: Lấy danh sách bình luận của hoạt động
    // POST: Thêm bình luận vào hoạt động
    activityComments: (activityID) => `/activities/${activityID}/comments/`, // GET, POST
    activityLike: (activityID) => `/activities/${activityID}/like/`, // POST: Thích hoạt động
    activityRegister: (activityID) => `/activities/${activityID}/register/`, // POST: Sinh viên đăng ký hoạt động
    activityReport: (activityID) => `/activities/${activityID}/report/`, // POST: Sinh viên báo thiếu hoạt động

    // Reports
    reports: '/reports/', // GET: Lấy danh sách báo thiếu
    reportDetails: (reportID) => `/reports/${reportID}/`, // GET: Lấy thông tin chi tiết của báo thiếu
    confirmReport: (reportID) => `/reports/${reportID}/confirm/`, // POST: Xác nhận báo thiếu
    rejectReport: (reportID) => `/reports/${reportID}/reject/`, // POST: Từ chối báo thiếu

    // Comments
    // PUT: Cập nhật bình luận
    // DELETE: Xóa bình luận
    commentDetails: (commentID) => `/comments/${commentID}/`, // PUT, DELETE

    // Semesters
    semesters: '/semesters/', // GET: Lấy danh sách học kỳ

    // Criterions
    criterions: '/criterions/', // GET: Lấy danh sách quy chế điểm rèn luyện

    // Statistics
    statisticsSchools: '/statistics/school/', // GET: Thống kê toàn trường
    statisticsFilter: (semesterCode) => `/statistics/points/${semesterCode}/`, // GET: Thống kê theo khoa hoặc lớp hoặc cả 2

    // Files
    attendanceUpload: '/files/attendance/upload/csv/', // POST: Upload file điểm danh
};

export default axios.create({ baseURL: API_URL });
