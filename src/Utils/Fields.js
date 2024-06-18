import moment from 'moment';
import { roles } from '../Configs/Constants';

export const signInFields = [
   {
      label: 'Email',
      name: 'username',
      icon: 'email',
      keyboardType: 'email-address',
   },
   {
      label: 'Mật khẩu',
      name: 'password',
      icon: 'eye',
   },
];

export const signUpFields = [
   {
      label: 'Mã số sinh viên',
      name: 'code',
      icon: 'badge-account',
      keyboardType: 'numeric',
   },
   {
      label: 'Email',
      name: 'email',
      icon: 'email',
      keyboardType: 'email-address',
   },
   {
      label: 'Mật khẩu',
      name: 'password',
      icon: 'eye',
   },
   {
      label: 'Xác nhận mật khẩu',
      name: 'confirm',
      icon: 'eye',
   },
];

export const initalActivity = {
   name: { label: 'Tên hoạt động', value: '', required: true },
   participant: { label: 'Đối tượng', value: '', required: true },
   organizational_form: { label: 'Hình thức', value: 'Onl', required: false },
   location: { label: 'Địa điểm', value: '', required: true },
   point: { label: 'Điểm', value: '', required: true },
   criterion: { label: 'Điều', value: null, required: false },
   start_date: { label: 'Ngày bắt đầu', value: moment(new Date()).format('YYYY-MM-DD'), required: true },
   end_date: { label: 'Ngày kết thúc', value: moment(new Date()).format('YYYY-MM-DD'), required: true },
   faculty: { label: 'Khoa', value: null, required: true },
   semester: { label: 'Học kỳ', value: null, required: true },
   bulletin: { label: 'Bản tin', value: null, required: false },
   image: { label: 'Hình ảnh', value: null, required: false },
   description: { label: 'Mô tả hoạt động', value: '', required: true },
};

export const profileSections = [
   {
      title: 'Chức năng',
      roles: [roles.ADMINISTRATOR, roles.SPECIALIST, roles.ASSISTANT],
      items: [
         { label: 'Quản lý hoạt động', icon: 'wrench-outline', screen: 'ActivitySettings' },
         // { label: '', icon: '', screen: '' },
      ],
   },
   {
      title: 'Tiện ích',
      roles: [roles.STUDENT],
      items: [
         { label: 'Điểm rèn luyện', icon: 'star-outline', screen: 'TrainingPoint' },
         { label: 'Hoạt động của sinh viên', icon: 'ticket', screen: '' },
      ],
   },
   {
      title: 'Cài đặt',
      roles: [roles.ADMINISTRATOR, roles.SPECIALIST, roles.ASSISTANT, roles.STUDENT],
      items: [
         { label: 'Cài đặt bảo mật', icon: 'shield-account', screen: '' },
         { label: 'Cài đặt thông báo', icon: 'bell-outline', screen: '' },
         // { label: 'Cài đặt chung', icon: 'cog-outline', screen: '' },
      ],
   },
   {
      title: 'Trợ giúp',
      roles: [roles.ADMINISTRATOR, roles.SPECIALIST, roles.ASSISTANT, roles.STUDENT],
      items: [
         { label: 'Trung tâm trợ giúp', icon: 'help-circle-outline', screen: 'ChatList', otherStack: 'ChatStack' },
         // { label: '', icon: '', screen: '' },
      ],
   },
];

export const schoolFields = [
   { label: 'Hệ đào tạo', name: 'educational_system', icon: 'school' },
   { label: 'Khoa', name: 'faculty', icon: 'school' },
   { label: 'Khóa', name: 'academic_year', icon: 'calendar' },
   { label: 'Ngành', name: 'major', icon: 'book-open-page-variant' },
   { label: 'Lớp', name: 'sclass', icon: 'account-group' },
];

export const accountFields = (currentAccount) => {
   return [
      {
         label: 'Email',
         name: 'email',
         value: currentAccount.data.email,
         icon: 'email',
         disabled: true,
      },
      {
         label:
            currentAccount.data.original_role.toLowerCase() === 'administrator'
               ? 'Mã số quản trị viên'
               : `Mã số ${currentAccount.data.original_role.toLowerCase()}`,
         name: 'code',
         value: currentAccount.data.user.code,
         icon: 'badge-account',
         disabled: true,
      },
   ];
};

export const userFields = [
   {
      label: 'Họ',
      name: 'last_name',
      icon: 'account-eye',
   },
   {
      label: 'Tên đệm',
      name: 'middle_name',
      icon: 'account-eye',
   },
   {
      label: 'Tên',
      name: 'first_name',
      icon: 'account-eye',
   },
   {
      label: 'Địa chỉ',
      name: 'address',
      icon: 'map-marker',
   },
   {
      label: 'Số điện thoại',
      name: 'phone_number',
      icon: 'phone',
      keyboardType: 'numeric',
   },
];

export const tabsContent = {
   bulletin: [
      { label: 'Tổng quan', name: 'overview' },
      { label: 'Hoạt động', name: 'activities' },
   ],
   activity: [
      { label: 'Tổng quan', name: 'overview' },
      { label: 'Bình luận', name: 'comments' },
   ],
   editProfile: [
      { label: 'Thông tin trường', name: 'school' },
      { label: 'Thông tin cá nhân', name: 'edit' },
   ],
};
