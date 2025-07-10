import React, { useState, useEffect } from 'react';
import { X, Film, Globe, Lock, AlertCircle, Save } from 'lucide-react';
import { 
  updateThemedCollection, 
  CreateCollectionData, 
  ThemedCollection 
} from '../services/themedCollectionsService';

interface EditCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  collection: ThemedCollection | null;
  onSuccess: (updatedCollection: ThemedCollection) => void;
}

const EditCollectionModal: React.FC<EditCollectionModalProps> = ({ 
  isOpen, 
  onClose, 
  collection,
  onSuccess 
}) => {
  const [formData, setFormData] = useState<CreateCollectionData>({
    title: '',
    description: '',
    is_public: false,
    cover_image: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (collection && isOpen) {
      setFormData({
        title: collection.title,
        description: collection.description || '',
        is_public: collection.is_public,
        cover_image: collection.cover_image || '',
      });
      setError('');
    }
  }, [collection, isOpen]);

  if (!isOpen || !collection) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Collection title is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await updateThemedCollection(collection.id, formData);
      if (success) {
        const updatedCollection: ThemedCollection = {
          ...collection,
          ...formData,
          updated_at: new Date().toISOString()
        };
        onSuccess(updatedCollection);
        onClose();
      } else {
        setError('Failed to update collection. Please try again.');
      }
    } catch (error) {
      console.error('Error updating collection:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while updating the collection.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setError('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#283039] rounded-xl max-w-md w-full p-6 relative">
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-[#9cabba] hover:text-white transition-colors disabled:opacity-50"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Film size={20} className="text-white" />
          </div>
          <h2 className="text-white text-xl font-bold">Edit Collection</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Collection Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Best of 80s Cinema"
              className="w-full bg-[#1a1f24] text-white rounded-lg px-3 py-2 border border-[#3a424d] focus:border-blue-500 focus:outline-none transition-colors"
              disabled={isLoading}
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your collection..."
              rows={3}
              className="w-full bg-[#1a1f24] text-white rounded-lg px-3 py-2 border border-[#3a424d] focus:border-blue-500 focus:outline-none transition-colors resize-none"
              disabled={isLoading}
              maxLength={500}
            />
          </div>

          {/* Cover Image URL */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Cover Image URL (Optional)
            </label>
            <input
              type="url"
              value={formData.cover_image}
              onChange={(e) => setFormData(prev => ({ ...prev, cover_image: e.target.value }))}
              placeholder="https://example.com/image.jpg"
              className="w-full bg-[#1a1f24] text-white rounded-lg px-3 py-2 border border-[#3a424d] focus:border-blue-500 focus:outline-none transition-colors"
              disabled={isLoading}
            />
          </div>

          {/* Privacy Setting */}
          <div className="p-4 bg-[#1a1f24] rounded-lg border border-[#3a424d]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-white text-sm font-medium">Make Collection Public</p>
                <p className="text-[#9cabba] text-xs">Allow other users to discover and view this collection</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, is_public: !prev.is_public }))}
                disabled={isLoading}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  formData.is_public ? 'bg-blue-600' : 'bg-[#3a424d]'
                } disabled:opacity-50`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    formData.is_public ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center gap-2 text-[#9cabba] text-xs">
              {formData.is_public ? (
                <>
                  <Globe size={12} />
                  <span>Public - Visible to all users</span>
                </>
              ) : (
                <>
                  <Lock size={12} />
                  <span>Private - Only visible to you</span>
                </>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 bg-[#3a424d] text-white py-2 px-4 rounded-lg hover:bg-[#4a525d] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formData.title.trim()}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCollectionModal;