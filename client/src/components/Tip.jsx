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
        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add Highlight
      </button>
    );
  }

  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-[#202020] p-3 rounded shadow-lg border border-gray-700 w-64 max-w-full"
    >
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add your comment..."
        className="w-full p-2 border border-gray-600 rounded bg-[#2d2d2d] text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="3"
      />
      <div className="flex justify-end gap-2 mt-2">
        <button
          type="button"
          onClick={handleCancel}
          className="px-3 py-1 text-gray-300 hover:text-gray-100 focus:outline-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default Tip;