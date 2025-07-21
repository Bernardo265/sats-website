import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import adminPriceService from '../../services/adminPriceService';
import priceService from '../../services/priceService';
import {
  CurrencyDollarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowPathIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

/**
 * Admin Price Management Panel
 * Allows authorized admins to override Bitcoin prices
 */
const PriceManagement = () => {
  const { user } = useAuth();
  const [currentPrice, setCurrentPrice] = useState(null);
  const [activeOverride, setActiveOverride] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOverrideForm, setShowOverrideForm] = useState(false);
  const [overrideHistory, setOverrideHistory] = useState([]);
  const [auditLog, setAuditLog] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    priceUsd: '',
    priceMwk: '',
    reason: '',
    durationMinutes: '',
    disableAutoUpdates: false
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadInitialData();
    
    // Set up real-time updates
    const interval = setInterval(loadCurrentData, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [user]);

  const loadInitialData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      await Promise.all([
        loadPermissions(),
        loadCurrentData(),
        loadOverrideHistory(),
        loadAuditLog()
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPermissions = async () => {
    try {
      const perms = await adminPriceService.getAdminPermissions(user.id);
      setPermissions(perms);
    } catch (error) {
      console.error('Error loading permissions:', error);
    }
  };

  const loadCurrentData = async () => {
    try {
      const [price, override] = await Promise.all([
        priceService.getCurrentPrice(),
        adminPriceService.getActiveOverride()
      ]);
      
      setCurrentPrice(price);
      setActiveOverride(override);
    } catch (error) {
      console.error('Error loading current data:', error);
    }
  };

  const loadOverrideHistory = async () => {
    try {
      const result = await adminPriceService.getPriceOverrideHistory(20);
      if (result.success) {
        setOverrideHistory(result.data);
      }
    } catch (error) {
      console.error('Error loading override history:', error);
    }
  };

  const loadAuditLog = async () => {
    try {
      const result = await adminPriceService.getPriceAuditLog(50);
      if (result.success) {
        setAuditLog(result.data);
      }
    } catch (error) {
      console.error('Error loading audit log:', error);
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }

    // Auto-calculate MWK price when USD price changes
    if (field === 'priceUsd' && value && !isNaN(value)) {
      const usdPrice = parseFloat(value);
      const mwkRate = currentPrice?.usd_mwk_rate || 1730;
      const mwkPrice = usdPrice * mwkRate;
      setFormData(prev => ({ ...prev, priceMwk: mwkPrice.toFixed(2) }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.priceUsd || isNaN(formData.priceUsd) || parseFloat(formData.priceUsd) <= 0) {
      errors.priceUsd = 'Valid USD price is required';
    }

    if (!formData.priceMwk || isNaN(formData.priceMwk) || parseFloat(formData.priceMwk) <= 0) {
      errors.priceMwk = 'Valid MWK price is required';
    }

    if (!formData.reason || formData.reason.trim().length < 10) {
      errors.reason = 'Reason must be at least 10 characters';
    }

    if (formData.durationMinutes && (isNaN(formData.durationMinutes) || parseInt(formData.durationMinutes) <= 0)) {
      errors.durationMinutes = 'Duration must be a positive number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitOverride = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const params = {
        adminUserId: user.id,
        priceUsd: parseFloat(formData.priceUsd),
        priceMwk: parseFloat(formData.priceMwk),
        usdMwkRate: currentPrice?.usd_mwk_rate || 1730,
        reason: formData.reason.trim(),
        durationMinutes: formData.durationMinutes ? parseInt(formData.durationMinutes) : null,
        disableAutoUpdates: formData.disableAutoUpdates,
        previousPriceUsd: currentPrice?.price_usd,
        previousPriceMwk: currentPrice?.price_mwk
      };

      const result = await adminPriceService.createPriceOverride(params);

      if (result.success) {
        // Reset form
        setFormData({
          priceUsd: '',
          priceMwk: '',
          reason: '',
          durationMinutes: '',
          disableAutoUpdates: false
        });
        setShowOverrideForm(false);

        // Reload data
        await loadCurrentData();
        await loadOverrideHistory();
        await loadAuditLog();

        alert('Price override created successfully!');
      } else {
        alert(`Error creating price override: ${result.error}`);
      }
    } catch (error) {
      console.error('Error submitting override:', error);
      alert('Error creating price override. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeactivateOverride = async () => {
    if (!activeOverride || !window.confirm('Are you sure you want to deactivate the current price override?')) {
      return;
    }

    try {
      const reason = prompt('Please provide a reason for deactivating this override:');
      if (!reason) return;

      const result = await adminPriceService.deactivatePriceOverride(
        activeOverride.id,
        user.id,
        reason
      );

      if (result.success) {
        await loadCurrentData();
        await loadOverrideHistory();
        await loadAuditLog();
        alert('Price override deactivated successfully!');
      } else {
        alert(`Error deactivating override: ${result.error}`);
      }
    } catch (error) {
      console.error('Error deactivating override:', error);
      alert('Error deactivating override. Please try again.');
    }
  };

  const formatCurrency = (amount, currency = 'USD') => {
    if (!amount) return 'N/A';
    
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    } else {
      return `MWK ${new Intl.NumberFormat().format(amount)}`;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-yellow-100 text-yellow-800',
      deactivated: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <ArrowPathIcon className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading price management...</span>
      </div>
    );
  }

  if (!permissions?.can_manage_prices) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3" />
          <div>
            <h3 className="text-lg font-medium text-red-800">Access Denied</h3>
            <p className="text-red-600 mt-1">You don't have permission to manage Bitcoin prices.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bitcoin Price Management</h1>
          <p className="text-gray-600 mt-1">Monitor and override Bitcoin price data</p>
        </div>
        {permissions?.can_override_prices && (
          <button
            onClick={() => setShowOverrideForm(!showOverrideForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {showOverrideForm ? 'Cancel Override' : 'Create Price Override'}
          </button>
        )}
      </div>

      {/* Current Price Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Market Price */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Current Market Price</h3>
            <CurrencyDollarIcon className="h-6 w-6 text-green-500" />
          </div>
          
          {currentPrice ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">USD Price:</span>
                <span className="font-semibold">{formatCurrency(currentPrice.price_usd)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">MWK Price:</span>
                <span className="font-semibold">{formatCurrency(currentPrice.price_mwk, 'MWK')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Source:</span>
                <span className="text-sm">{currentPrice.source || 'Unknown'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span className="text-sm">{formatDateTime(currentPrice.last_updated)}</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No price data available</p>
          )}
        </div>

        {/* Active Override Status */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Override Status</h3>
            {activeOverride ? (
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
            ) : (
              <CheckCircleIcon className="h-6 w-6 text-green-500" />
            )}
          </div>
          
          {activeOverride ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                {getStatusBadge('active')}
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Override Price (USD):</span>
                <span className="font-semibold">{formatCurrency(activeOverride.price_usd)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Override Price (MWK):</span>
                <span className="font-semibold">{formatCurrency(activeOverride.price_mwk, 'MWK')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reason:</span>
                <span className="text-sm text-right max-w-xs">{activeOverride.reason}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Admin:</span>
                <span className="text-sm">{activeOverride.admin_name}</span>
              </div>
              {activeOverride.expires_at && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Expires:</span>
                  <span className="text-sm">{formatDateTime(activeOverride.expires_at)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Auto Updates:</span>
                <span className="text-sm">{activeOverride.disable_auto_updates ? 'Disabled' : 'Enabled'}</span>
              </div>
              
              {permissions?.can_override_prices && (
                <div className="pt-3 border-t">
                  <button
                    onClick={handleDeactivateOverride}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Deactivate Override
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <p className="text-gray-600">No active price override</p>
              <p className="text-sm text-gray-500">Market prices are being used</p>
            </div>
          )}
        </div>
      </div>

      {/* Price Override Form */}
      {showOverrideForm && permissions?.can_override_prices && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Create Price Override</h3>
          
          <form onSubmit={handleSubmitOverride} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  USD Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.priceUsd}
                  onChange={(e) => handleFormChange('priceUsd', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.priceUsd ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter USD price"
                />
                {formErrors.priceUsd && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.priceUsd}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  MWK Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.priceMwk}
                  onChange={(e) => handleFormChange('priceMwk', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.priceMwk ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter MWK price"
                />
                {formErrors.priceMwk && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.priceMwk}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Override *
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => handleFormChange('reason', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.reason ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Explain why you're overriding the price..."
              />
              {formErrors.reason && (
                <p className="text-red-500 text-sm mt-1">{formErrors.reason}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={formData.durationMinutes}
                  onChange={(e) => handleFormChange('durationMinutes', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    formErrors.durationMinutes ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Leave empty for indefinite"
                />
                {formErrors.durationMinutes && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.durationMinutes}</p>
                )}
                <p className="text-gray-500 text-sm mt-1">Leave empty for indefinite override</p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="disableAutoUpdates"
                  checked={formData.disableAutoUpdates}
                  onChange={(e) => handleFormChange('disableAutoUpdates', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="disableAutoUpdates" className="ml-2 block text-sm text-gray-700">
                  Disable automatic price updates
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => setShowOverrideForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Create Override'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Override History */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Price Overrides</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price (USD/MWK)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {overrideHistory.map((override) => (
                <tr key={override.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{override.admin_name}</div>
                    <div className="text-sm text-gray-500">{override.admin_email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(override.price_usd)}</div>
                    <div className="text-sm text-gray-500">{formatCurrency(override.price_mwk, 'MWK')}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate" title={override.reason}>
                      {override.reason}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(override.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateTime(override.created_at)}
                  </td>
                </tr>
              ))}
              {overrideHistory.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No price overrides found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PriceManagement;
