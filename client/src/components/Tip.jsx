import React, { useState } from 'react';

const Tip = ({ onConfirm }) => {
  const [state, setState] = useState('compact'); // 'compact' or 'expanded'
  const [comment, setComment] = useState('');

  const handleAddHighlightClick = () => {
    setState('expanded');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({ text: comment });
  };

  const handleCancel = () => {
    setState('compact');
    setComment('');
  };

  if (state === 'compact') {
    return (
      <button
        onClick={handleAddHighlightClick}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Add Highlight
      </button>
    );
  }

  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-white p-3 rounded shadow-lg border border-gray-200 w-64"
    >
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add your comment..."
        className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
        rows="3"
      />
      <div className="flex justify-end gap-2 mt-2">
        <button
          type="button"
          onClick={handleCancel}
          className="px-3 py-1 text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default Tip;