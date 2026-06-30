import { memo } from 'react';
import { getEntityId } from '../../utils/entity';

const UsersTable = memo(({ users, onBanUser, onUnbanUser, onDeleteUser }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="bg-gray-50 dark:bg-slate-800">
          <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-slate-200">نام</th>
          <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-slate-200">نام کاربری</th>
          <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-slate-200">شماره موبایل</th>
          <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-slate-200">وضعیت</th>
          <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-slate-200">تعداد آگهی</th>
          <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-slate-200">عملیات</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={getEntityId(user)} className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/60">
            <td className="px-4 py-3">
              <div className="font-medium text-gray-900 dark:text-slate-100">{user.name}</div>
            </td>
            <td className="px-4 py-3 text-sm text-gray-900 dark:text-slate-100">{user.username}</td>
            <td className="px-4 py-3 text-sm text-gray-900 dark:text-slate-100">{user.phone}</td>
            <td className="px-4 py-3">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.isBanned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                {user.isBanned ? 'مسدود شده' : 'فعال'}
              </span>
            </td>
            <td className="px-4 py-3 text-sm text-gray-900 dark:text-slate-100">{user.adsCount || 0}</td>
            <td className="px-4 py-3">
              <div className="flex space-x-2 space-x-reverse">
                {user.isBanned ? (
                  <button onClick={() => onUnbanUser(getEntityId(user))} className="text-green-600 hover:text-green-800 text-sm">آزادسازی</button>
                ) : (
                  <button onClick={() => onBanUser(getEntityId(user))} className="text-yellow-600 hover:text-yellow-800 text-sm">مسدود کردن</button>
                )}
                <button onClick={() => onDeleteUser(getEntityId(user))} className="text-red-600 hover:text-red-800 text-sm">حذف</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
));

UsersTable.displayName = 'UsersTable';
export default UsersTable;
