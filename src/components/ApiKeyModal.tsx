import React, { useState } from 'react';
import { X, Key, AlertCircle, Database } from 'lucide-react';
import { isStorageEnabled, setStoragePermission } from '../services/storageService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
  currentApiKey?: string;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave, currentApiKey }) => {
  const [apiKey, setApiKey] = useState(currentApiKey || '');
  const [error, setError] = useState('');
  const [storageEnabled, setStorageEnabledState] = useState(isStorageEnabled());

  if (!isOpen) return null;

  const handleSave = () => {
    if (!apiKey.trim()) {
      setError('Please enter a valid API key');
      return;
    }
    
    if (!apiKey.startsWith('gsk_')) {
      setError('Groq API keys should start with "gsk_"');
      return;
    }

    setError('');
    onSave(apiKey.trim());
    onClose();
  };

  const handleClose = () => {
    setError('');
    setApiKey(currentApiKey || '');
    setStorageEnabledState(isStorageEnabled());
    onClose();
  };

  const handleStorageToggle = (enabled: boolean) => {
    setStoragePermission(enabled);
    setStorageEnabledState(enabled);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#283039] rounded-xl max-w-md w-full p-6 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-[#9cabba] hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Key size={20} className="text-white" />
          </div>
          <h2 className="text-white text-xl font-bold">Configure Groq API</h2>
        </div>

        <div className="mb-4">
          <p className="text-[#9cabba] text-sm mb-4">
            To use CineMatch, you need to provide your Groq API key. Your key will be stored locally in your browser.
          </p>
          
          <div className="bg-[#1a1f24] rounded-lg p-3 mb-4">
            <p className="text-[#9cabba] text-xs mb-2">How to get your API key:</p>
            <ol className="text-[#9cabba] text-xs space-y-1 list-decimal list-inside">
              <li>Visit <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">console.groq.com</a></li>
              <li>Sign up or log in to your account</li>
              <li>Navigate to API Keys section</li>
              <li>Create a new API key</li>
              <li>Copy and paste it below</li>
            </ol>
          </div>
        </div>

        {/* Storage Permission Section */}
        <div className="mb-6 p-4 bg-[#1a1f24] rounded-lg border border-[#3a424d]">
          <div className="flex items-center gap-3 mb-3">
            <Database size={20} className="text-blue-400" />
            <h3 className="text-white text-lg font-semibold">Storage Settings</h3>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-white text-sm font-medium">Save Movies Locally</p>
              <p className="text-[#9cabba] text-xs">Allow CineMatch to save your favorite movies in browser storage</p>
            </div>
            <button
              onClick={() => handleStorageToggle(!storageEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                storageEnabled ? 'bg-blue-600' : 'bg-[#3a424d]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  storageEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="text-[#9cabba] text-xs">
            {storageEnabled ? (
              <p>✓ Movies will be saved to your browser's local storage</p>
            ) : (
              <p>⚠ Movie saving is disabled. Enable to save your favorites.</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2">
            Groq API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="gsk_..."
            className="w-full bg-[#1a1f24] text-white rounded-lg px-3 py-2 border border-[#3a424d] focus:border-blue-500 focus:outline-none transition-colors"
          />
          {error && (
            <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 bg-[#3a424d] text-white py-2 px-4 rounded-lg hover:bg-[#4a525d] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save API Key
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;