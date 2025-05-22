import { setAllAdminJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllAdminJobs = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setAllAdminJobs(res.data.jobs));
                }
                setError(null);
            } catch (error) {
                console.log(error);
                setError(error.response?.data?.message || 'Failed to fetch jobs');
            } finally {
                setLoading(false);
            }
        }
        fetchAllAdminJobs();
    }, [dispatch])

    return { loading, error };
}

export default useGetAllAdminJobs