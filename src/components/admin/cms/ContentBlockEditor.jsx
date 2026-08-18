"use client";
import { Plus } from 'lucide-react';
import BlockCard from './BlockCard';

export default function ContentBlockEditor({ blocks = [], onChange }) {
  
  const handleAddBlock = () => {
    const newBlock = {
      id: Date.now().toString(),
      key: `block_${Date.now()}`,
      title: 'New Content Block',
      heading: '',
      description: '',
      layout: 'Text',
      order: blocks.length,
      status: 'Active',
      fields: {}
    };
    onChange([...blocks, newBlock]);
  };

  const handleDuplicate = (index) => {
    const blockToCopy = blocks[index];
    const newBlock = {
      ...blockToCopy,
      id: Date.now().toString(),
      key: `block_${Date.now()}`,
      title: `${blockToCopy.title || 'Block'} (Copy)`,
      order: blocks.length
    };
    onChange([...blocks, newBlock]);
  };

  const handleDelete = (index) => {
    if (!confirm('Remove this block?')) return;
    const newBlocks = [...blocks];
    newBlocks.splice(index, 1);
    // Re-evaluate order
    newBlocks.forEach((b, i) => b.order = i);
    onChange(newBlocks);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index - 1];
    newBlocks[index - 1] = temp;
    newBlocks.forEach((b, i) => b.order = i);
    onChange(newBlocks);
  };

  const handleMoveDown = (index) => {
    if (index === blocks.length - 1) return;
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index + 1];
    newBlocks[index + 1] = temp;
    newBlocks.forEach((b, i) => b.order = i);
    onChange(newBlocks);
  };

  const handleChange = (index, updatedBlock) => {
    const newBlocks = [...blocks];
    newBlocks[index] = updatedBlock;
    onChange(newBlocks);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Dynamic Content Blocks</h3>
          <p className="text-sm text-gray-500 mt-1">Build your page layout sequentially.</p>
        </div>
        <button 
          type="button"
          onClick={handleAddBlock}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Block
        </button>
      </div>

      {blocks.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
          <p className="text-gray-500 mb-4">No content blocks added yet.</p>
          <button 
            type="button"
            onClick={handleAddBlock}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add First Block
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {blocks.sort((a, b) => a.order - b.order).map((block, index) => (
            <BlockCard 
              key={block.id || index}
              block={block}
              index={index}
              totalBlocks={blocks.length}
              onChange={(updatedBlock) => handleChange(index, updatedBlock)}
              onMoveUp={() => handleMoveUp(index)}
              onMoveDown={() => handleMoveDown(index)}
              onDuplicate={() => handleDuplicate(index)}
              onDelete={() => handleDelete(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
