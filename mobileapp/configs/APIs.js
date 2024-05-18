import axios from "axios";

const BASE_URL = "https://trainingpoint.vercel.app";
const TYPE = "api";
const VERSION = "v1";
const URL = `${BASE_URL}/${TYPE}/${VERSION}/`;

export const endpoints = {
    //// Accounts
    "roles": "accounts/roles", // GET: Lấy danh sách vai trò
    "me": "/accounts/me/", // GET: Xem thông tin tài khoản đang đăng nhập
    "token": "o/applications", // POST: Lấy token
    "login": "acconuts/auth/login/", // POST: Đăng nhập
    "student-register": "accounts/auth/student/register/", // POST: Đăng ký tài khoản cho sinh viên
    "assistant-register": "accounts/auth/assistant/register/", // POST: Đăng ký tài khoản cho trợ lý sinh viên
    "me-update": "/accounts/me/update/", // PATCH: Cập nhật tài khoản đang đăng nhập

    //// Students
    "students": "/students/", // GET: Lấy danh sách sinh viên
    "student-details": (studentID) => `/students/${studentID}/`, // GET: Lấy thông tin chi tiết của sinh viên
    "student-activities": (studentID) => `/students/${studentID}/activities/`, // GET: Lấy danh sách hoạt động của sinh viên
    "student-points": (studentID, semesterCode) => `/students${studentID}/points/${semesterCode}`, // GET: Thống kê điểm rèn luyện của sinh viên

    //// Assistant
    "assistants": "/assistants/", // GET: Lấy danh sách trợ lý sinh viên
    "assistant-details": (assistantID) => `/assistants/${assistantID}/`, // GET: Lấy thông tin chi tiết trợ lý sinh viên

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
    "bulletins": "/bulletins/", // GET, POST
    "bulletin-details": (bulletinID) => `/bulletins/${bulletinID}/`, // GET, PATCH, DELETE
    "bulletin-activity": (bulletinID, activityID) => `/bulletins/${bulletinID}/activites/${activityID}/`, // POST, DELETE

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
    "activities": "/activities/", // GET, POST
    "activity-details": (activityID) => `/activities/${activityID}/`, // GET, PATCH, DELETE
    "activity-comments": (activityID) => `/activities/${activityID}/comments/`, // GET, POST
    "activity-like": (activityID) => `/activities/${activityID}/like/`, // POST
    "activity-register": (activityID) => `/activities/${activityID}/register/`, // POST
    "activity-report": (activityID) => `/activities/${activityID}/report/`, // POST

    //// Missing Reports
    "reports": "/reports/", // GET: Lấy danh sách báo thiếu (có thể lọc theo sinh viên, hoạt động, khoa)
    "report-details": (reportID) => `/reports/${reportID}/`, // GET: Lấy thông tin chi tiết của báo thiếu
    "confirm-report": (reportID) => `/reports/${reportID}/confirm/`, // POST: Xác nhận báo thiếu
    "reject-report": (reportID) => `/reports/${reportID}/reject/`, // POST: Từ chối báo thiếu

    //// Comments
    /*
    * PUT: Cập nhật bình luận
    * DELETE: Xóa bình luận
     */
    "comment-details": (commentID) => `/comments/${commentID}/`, // PUT, DELETE

    //// Classes
    "classes": "/classes/", // GET: Lấy danh sách lớp (có thể lọc theo khoa)

    //// Semesters
    "semesters": "/semesters/", // GET: Lấy danh sách học kỳ

    //// Criterions
    "criterions": "/criterions/", // GET: Lấy danh sách quy chế điểm rèn luyện

    //// Statistics
    "statistics": (semesterCode) => `/statistics/points/${semesterCode}/`, // GET: Thống kê theo khoa hoặc lớp hoặc cả 2

    //// Files
    "attendance-upload": "/files/attendance/upload/csv/", // POST: Upload file điểm danh
};

export const authAPI = (accessToken) => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    })
}

export default axios.create({baseURL: URL});
