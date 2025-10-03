'use client'

import { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { Select, notification, DatePicker } from 'antd'
import axios from 'axios'
import { API_URL } from '@/app/components/utils/BASE_URL'

// Extend dayjs with UTC plugin
dayjs.extend(utc)

export default function SubmitOfferForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [stores, setStores] = useState<any[]>([])
  const [formData, setFormData] = useState({
    store: '',
    offerType: 'In-Store Offer',
    offerLink: '',
    discountDescription: '',
    startDate: null as dayjs.Dayjs | null,
    endDate: null as dayjs.Dayjs | null
  })

  const [errors, setErrors] = useState<any>({})
  const [showSuccess, setShowSuccess] = useState(false)

  // Fetch stores on component mount
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(`${API_URL}/store`)
        setStores(response.data)
      } catch (error) {
        console.error('Error fetching stores:', error)
      }
    }
    
    fetchStores()
  }, []) // Empty dependency array to run only once on mount

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })

    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  const handleCheckboxChange = (value: any) => {
    setFormData({
      ...formData,
      offerType: value
    })
  }

  const handleDateChange = (date: dayjs.Dayjs | null, field: 'startDate' | 'endDate') => {
    setFormData({
      ...formData,
      [field]: date
    })

    // Clear error when field is updated
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      })
    }
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch (_) {
      return false
    }
  }
  
  const validate = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.store) {
      newErrors.store = 'Please select a store'
    }

    if (!formData.offerLink) {
      newErrors.offerLink = 'Offer link is required'
    } else if (!isValidUrl(formData.offerLink)) {
      newErrors.offerLink = 'Please enter a valid URL'
    }

    if (!formData.discountDescription) {
      newErrors.discountDescription = 'Discount description is required'
    }

    if (formData.startDate && formData.endDate) {
      if (formData.startDate.isAfter(formData.endDate)) {
        newErrors.endDate = 'End date must be after start date'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const clearForm = () => {
    setFormData({
      store: '',
      offerType: 'In-Store Offer',
      offerLink: '',
      discountDescription: '',
      startDate: null,
      endDate: null
    })
    setErrors({})
    setShowSuccess(false)
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (validate()) {
      // Format dates for backend using dayjs UTC
      const storeId = formData.store

      // Prepare data for API
      const couponData = {
        name: 'Requested coupon',
        storeId,
        offerType: formData.offerType,
        htmlCodeUrl: formData.offerLink,
        detail: formData.discountDescription,
        startDate: formData.startDate ? formData.startDate.utc().format() : null,
        endDate: formData.endDate ? formData.endDate.utc().format() : null,
      }

      try {
        setIsLoading(true)
        // Call the API endpoint using axios
        const response = await axios.post(`${API_URL}/coupons/public`, couponData)
        
        console.log("Coupon request submitted successfully:", response.data)
        setShowSuccess(true)
        notification.success({
          message: 'Success',
          description: 'Your offer was submitted and is currently being reviewed.',
          duration: 5,
        })
        setTimeout(() => setShowSuccess(false), 5000)
        clearForm()
      } catch (error) {
        console.error('Error saving coupon request:', error)
        // Handle API errors here
        setErrors({
          ...errors,
          api: 'Failed to submit offer. Please try again.'
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <>
      <div className="mt-[200px] md:mt-[100px] max-w-3xl mx-auto p-6">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-6 text-gray-800">Submit An Offer</h1>

        {showSuccess && (
          <div className="bg-gray-100 p-4 mb-6 rounded relative flex items-center">
            <span className="text-green-600 flex-grow">Success! Your offer was submitted and is currently being reviewed.</span>
            <button onClick={() => setShowSuccess(false)} className="text-gray-500">
              <FaTimes />
            </button>
          </div>
        )}

        {errors.api && (
          <div className="bg-red-50 p-4 mb-6 rounded relative flex items-center">
            <span className="text-red-600 flex-grow">{errors.api}</span>
            <button onClick={() => setErrors({ ...errors, api: '' })} className="text-gray-500">
              <FaTimes />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Select
              showSearch
              placeholder="Select a store"
              optionFilterProp="children"
              onChange={(value) =>
                handleInputChange({ target: { name: 'store', value } })
              }
              value={formData.store || undefined}
              className="w-full"
              filterOption={(input, option) =>
                (typeof option?.children === 'string' && (option?.children as string).toLowerCase().includes(input.toLowerCase()))
              }
              style={{ height: '45px' }}
            >
              {stores?.map((store: any) => (
                <Select.Option key={store.id} value={store.id}>
                  {store.name}
                </Select.Option>
              ))}
            </Select>
            {errors.store && <p className="text-red-500 text-sm mt-1">{errors.store}</p>}
          </div>

          <div className="flex mb-4 space-x-2 md:space-x-6 ">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.offerType === 'Online Code'}
                onChange={() => handleCheckboxChange('Online Code')}
                className="mr-2 h-4 md:h-5 w-4 md:w-5 accent-green-600"
              />
              <span className='text-gray-800'>Online Code</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.offerType === 'In-Store Offer'}
                onChange={() => handleCheckboxChange('In-Store Offer')}
                className="mr-2 h-4 md:h-5 w-4 md:w-5 accent-green-600"
              />
              <span className='text-gray-800'>In-Store Offer</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.offerType === 'Sale'}
                onChange={() => handleCheckboxChange('Sale')}
                className="mr-2 h-4 md:h-5 w-4 md:w-5 accent-green-600"
              />
              <span className='text-gray-800'>Sale</span>
            </label>
          </div>

          <div className="mb-4">
            <input
              type="text"
              name="offerLink"
              placeholder="Offer Link"
              className={`w-full p-2 border rounded ${errors.offerLink ? 'border-red-500' : ''}`}
              value={formData.offerLink}
              onChange={handleInputChange}
            />
            {errors.offerLink && <p className="text-red-500 text-sm mt-1">{errors.offerLink}</p>}
          </div>

          <div className="mb-4">
            <textarea
              name="discountDescription"
              placeholder="Discount description"
              rows={6}
              className={`w-full p-2 border rounded ${errors.discountDescription ? 'border-red-500' : ''}`}
              value={formData.discountDescription}
              onChange={handleInputChange}
            ></textarea>
            {errors.discountDescription && <p className="text-red-500 text-sm mt-1">{errors.discountDescription}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date (optional)</label>
            <DatePicker 
              className="w-full p-2 border rounded" 
              placeholder="Select start date"
              onChange={(date) => handleDateChange(date, 'startDate')}
              value={formData.startDate}
              format="YYYY-MM-DD"
              allowClear
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date (optional)</label>
            <DatePicker 
              className={`w-full p-2 border rounded ${errors.endDate ? 'border-red-500' : ''}`}
              placeholder="Select end date"
              onChange={(date) => handleDateChange(date, 'endDate')}
              value={formData.endDate}
              format="YYYY-MM-DD"
              allowClear
              disabledDate={(current) => {
                // Can't select days before start date
                return formData.startDate ? current && current < formData.startDate.startOf('day') : false;
              }}
            />
            {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
          </div>

          <div className="flex flex-col items-center space-y-4 w-full">
            <button
              type="submit"
              style={{ backgroundColor: '#7FA842' }}
              className="hover:bg-green-600 text-white font-medium py-3 px-6 rounded-full w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>

            <button
              type="button"
              style={{ backgroundColor: '#14303B' }}
              onClick={clearForm}
              className="hover:bg-green-600 text-white font-medium py-3 px-6 rounded-full w-full"
              disabled={isLoading}
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </>
  )
}