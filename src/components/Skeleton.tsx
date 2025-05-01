export default function DashboardSkeleton() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Skeleton */}
      <div className="w-64 bg-gray-900 m-4 rounded-xl shadow-lg">
        <div className="p-4 flex items-center">
          <div className="w-8 h-8 rounded bg-gray-700 animate-pulse"></div>
          <div className="h-6 w-32 bg-gray-700 ml-3 rounded animate-pulse"></div>
        </div>
        
        <div className="mt-8 px-4">
          {/* Navigation item skeletons */}
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center py-3">
              <div className="w-5 h-5 rounded bg-gray-700 animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-700 ml-3 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Main content skeleton */}
      <div className="flex-1 overflow-y-auto">

        {/* Dashboard content skeleton */}
        <main className="p-6">
          {/* Stats cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
          
          {/* Charts skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <ChartSkeleton />
            <ChartSkeleton />
          </div>
          
          {/* Table skeleton */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[...Array(4)].map((_, i) => (
                      <th key={i} className="px-6 py-3 text-left">
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...Array(5)].map((_, rowIndex) => (
                    <tr key={rowIndex}>
                      {[...Array(4)].map((_, colIndex) => (
                        <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                          <div 
                            className="h-4 bg-gray-200 rounded animate-pulse" 
                            style={{
                              width: `${colIndex === 0 ? '120px' : colIndex === 1 ? '60px' : colIndex === 2 ? '80px' : '70px'}`
                            }}
                          ></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Skeleton for stat cards
function StatCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
      </div>
      <div className="mt-4 flex items-center">
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
}

// Skeleton for charts
function ChartSkeleton() {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
      <div className="h-64 w-full bg-gray-100 rounded animate-pulse flex items-center justify-center">
        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
        </svg>
      </div>
    </div>
  );
}