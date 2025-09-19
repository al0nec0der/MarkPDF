import React from 'react';

const Sidebar = ({ highlights, scrollToHighlight }) => {
  // Truncate text to a specified length and add ellipsis
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="sidebar bg-[#181818] border-r border-gray-700 h-full flex flex-col">
      <div className="sidebar__header p-4 border-b border-gray-700">
        <h3 className="font-semibold text-lg text-gray-100">Annotations</h3>
        <p className="text-sm text-gray-400 mt-1">{highlights.length} highlights</p>
      </div>
      
      <div className="sidebar__content flex-1 overflow-y-auto overflow-x-hidden">
        {highlights.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <p>No highlights yet</p>
            <p className="text-sm mt-2">Select text in the PDF to create highlights</p>
          </div>
        ) : (
          <ul className="sidebar__highlights-list">
            {highlights.map((highlight, index) => (
              <li
                key={highlight.id}
                className="sidebar__highlight-item p-3 border-b border-gray-700 hover:bg-gray-700 cursor-pointer transition-colors"
                onClick={() => {
                  console.log('Sidebar item clicked, scrolling to highlight:', highlight);
                  scrollToHighlight(highlight);
                }}
              >
                <div className="flex justify-between items-start">
                  <p className="text-sm text-gray-200 flex-1">
                    {truncateText(highlight.content?.text || 'Area highlight')}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">
                    Page {highlight.position?.pageNumber || 'N/A'}
                  </span>
                  {highlight.comment?.text && (
                    <span className="text-xs bg-blue-900 text-blue-200 px-2 py-1 rounded">
                      Comment
                    </span>
                  )}
                </div>
                {highlight.comment?.text && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-300 italic">
                      {truncateText(highlight.comment.text, 60)}
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Sidebar;