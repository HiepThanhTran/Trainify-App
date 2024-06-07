import { roles } from '../configs/Constants';

export const signInFields = [
   {
      label: 'Email',
      name: 'username',
      icon: 'email',
      keyboardType: 'email-address',
      errorMessage: 'Email không được trống',
   },
   {
      label: 'Mật khẩu',
      name: 'password',
      icon: 'eye',
      errorMessage: 'Mật khẩu không được trống',
   },
];

export const signUpFields = [
   {
      label: 'Mã số sinh viên',
      name: 'code',
      icon: 'badge-account',
      keyboardType: 'numeric',
      errorMessage: 'Mã số sinh viên không được trống',
   },
   {
      label: 'Email',
      name: 'email',
      icon: 'email',
      keyboardType: 'email-address',
      errorMessage: 'Email không được trống',
   },
   {
      label: 'Mật khẩu',
      name: 'password',
      icon: 'eye',
      errorMessage: 'Mật khẩu không được trống',
   },
   {
      label: 'Xác nhận mật khẩu',
      name: 'confirm',
      icon: 'eye',
      errorMessage: 'Vui lòng xác nhận mật khẩu!',
   },
];

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
      items: [
         { label: 'Điểm rèn luyện', icon: 'star-outline', screen: 'TrainingPoint' },
         { label: 'Hoạt động của sinh viên', icon: 'ticket', screen: '' },
      ],
   },
   {
      title: 'Cài đặt',
      items: [
         { label: 'Cài đặt bảo mật', icon: 'shield-account', screen: '' },
         { label: 'Cài đặt thông báo', icon: 'bell-outline', screen: '' },
         // { label: 'Cài đặt chung', icon: 'cog-outline', screen: '' },
      ],
   },
   {
      title: 'Trợ giúp',
      items: [
         { label: 'Trung tâm trợ giúp', icon: 'help-circle-outline', screen: 'Test' },
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
      { label: 'Email', name: 'email', value: currentAccount.data.email, icon: 'email', disabled: true },
      {
         label: `Mã số ${currentAccount.data.original_role.toLowerCase()}`,
         name: 'code',
         value: currentAccount.data.user.code,
         icon: 'badge-account',
         disabled: true,
      },
   ];
};

export const userFields = [
   { label: 'Họ', name: 'last_name', icon: 'account-eye' },
   { label: 'Tên đệm', name: 'middle_name', icon: 'account-eye' },
   { label: 'Tên', name: 'first_name', icon: 'account-eye' },
   { label: 'Địa chỉ', name: 'address', icon: 'map-marker' },
   { label: 'Số điện thoại', name: 'phone_number', icon: 'phone', keyboardType: 'numeric' },
];

export const categoriesEditForm = [
   { label: 'Thông tin trường', id: 1 },
   { label: 'Thông tin cá nhân', id: 2 },
];
