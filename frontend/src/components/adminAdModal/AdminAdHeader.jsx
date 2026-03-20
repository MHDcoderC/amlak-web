const AdminAdHeader = ({ title, statusText, statusColor, createdAt, onClose }) => (
  <div className="sticky top-0 bg-gradient-to-r from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-800 border-b border-gray-200 dark:border-slate-700 p-6 rounded-t-2xl backdrop-blur-sm">
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
      <div className="mb-4 sm:mb-0">
        <h2 className="text-3xl sm:text-4xl font-bold text-blue-700 dark:text-blue-400 mb-3">{title}</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <span className={`inline-flex px-6 py-3 text-sm font-semibold rounded-xl border-2 shadow-lg ${statusColor}`}>
            {statusText}
          </span>
          <span className="text-gray-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600">
            <span className="ml-2">📅</span>
            {new Date(createdAt).toLocaleDateString('fa-IR')}
          </span>
        </div>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 text-4xl font-bold p-3 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-300 hover:scale-110">
        ×
      </button>
    </div>
  </div>
);

export default AdminAdHeader;
