import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen, ExternalLink, Download, X } from 'lucide-react';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector } from 'react-redux';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';

// Configure PDF worker using CDN (more reliable approach)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;


const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const [resumeModalOpen, setResumeModalOpen] = useState(false);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const { user } = useSelector(store => store.auth);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setPageNumber(1);
    };

    const changePage = (offset) => {
        setPageNumber(prevPageNumber => prevPageNumber + offset);
    };

    const previousPage = () => {
        changePage(-1);
    };

    const nextPage = () => {
        changePage(1);
    };

const handleViewResume = () => {
  if (user?.profile?.resume) {
    // If it's a URL, open in new tab
    if (user.profile.isResumeAUrl) {
      window.open(user.profile.resume, '_blank');
    } else {
      // For local files, extract the filename properly
      const filename = user.profile.resume.split('/').pop();
      // Use the correct API endpoint
      const resumeUrl = `http://localhost:8000/api/resume/${filename}`;
      
      // For modal view
      setResumeModalOpen(true);
      
      // Alternatively, to open in new tab:
      // window.open(resumeUrl, '_blank');
    }
  }
};

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 dark:from-gray-900 dark:via-gray-600 dark:to-gray-700 flex flex-col">
            <Navbar />
            
            <div className="flex-grow pb-10">
                <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl mt-5 mb-6 p-8 dark:bg-gray-800 dark:border-gray-700'>
                    <div className='flex justify-between'>
                        <div className='flex items-center gap-4'>
                            <Avatar className="h-24 w-24">
                                <AvatarImage 
                                    src={user?.profile?.profilePhoto} alt="avatar" />
                            </Avatar>
                            <div>
                                <h1 className='font-medium text-xl dark:text-white'>{user?.fullname}</h1>
                                <p className='dark:text-gray-300'>{user?.profile?.bio}</p>
                            </div>
                        </div>
                        <Button 
                            onClick={() => setOpen(true)} 
                            className="text-right bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                        >
                            <Pen className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className='my-5'>
                        <div className='flex items-center gap-3 my-2 dark:text-gray-300'>
                            <Mail className='dark:text-gray-400' />
                            <span>{user?.email}</span>
                        </div>
                        <div className='flex items-center gap-3 my-2 dark:text-gray-300'>
                            <Contact className='dark:text-gray-400' />
                            <span>{user?.phoneNumber}</span>
                        </div>
                    </div>
                    <div className='my-5'>
                        <h1 className="font-medium dark:text-white">Skills</h1>
                        <div className='flex items-center gap-1 mt-2'>
                            {
                                user?.profile?.skills?.length > 0 ? 
                                user.profile.skills.map((item, index) => (
                                    <Badge key={index} className='dark:bg-gray-700 dark:text-white'>{item}</Badge>
                                )) : 
                                <span className="text-gray-500 dark:text-gray-400">No skills added</span>
                            }
                        </div>
                    </div>
                    <div className='grid w-full max-w-sm items-center gap-1.5'>
                        <Label className="text-md font-bold dark:text-white">Resume</Label>
                        {user?.profile?.resume ? (
                            <div className="flex items-center gap-2">
                                {user.profile.isResumeAUrl ? (
                                    <a 
                                        href={user.profile.resume} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline dark:text-blue-400"
                                    >
                                        View Resume (External Link) ↗
                                    </a>
                                ) : (
                                    <>
                                        <Button 
                                            variant="outline" 
                                            onClick={handleViewResume}
                                            className="text-blue-600 dark:text-blue-400"
                                        >
                                            View Resume
                                        </Button>
                                    </>
                                )}
                            </div>
                        ) : (
                            <span className="text-gray-500 dark:text-gray-400">No resume uploaded</span>
                        )}
                    </div>
                </div>

                <div className='max-w-4xl mx-auto bg-white rounded-2xl mb-10 dark:bg-gray-800 dark:border-gray-700'>
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4 dark:text-white">Your Job Applications</h2>
                        <div className="max-h-[500px] overflow-y-auto pr-2">
                            <AppliedJobTable />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
            
            <UpdateProfileDialog open={open} setOpen={setOpen}/>

            {/* Resume Modal */}
            {resumeModalOpen && user?.profile?.resume && !user.profile.isResumeAUrl && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
                            <h3 className="text-lg font-semibold dark:text-white">
                                {user.profile.resumeOriginalName || "Resume"}
                            </h3>
                            <Button 
                                variant="ghost" 
                                onClick={() => setResumeModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <div className="flex-grow overflow-auto p-4">
                            <Document
                                file={user.profile.resume}
                                onLoadSuccess={onDocumentLoadSuccess}
                                loading={<div className="p-4 text-center">Loading resume...</div>}
                                error={<div className="p-4 text-center text-red-500">Failed to load resume. Please try downloading instead.</div>}
                            >
                                <Page 
                                    pageNumber={pageNumber} 
                                    width={800}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                />
                            </Document>
                        </div>
                        <div className="flex justify-between items-center p-4 border-t dark:border-gray-700">
                            <Button 
                                variant="outline" 
                                onClick={previousPage}
                                disabled={pageNumber <= 1}
                            >
                                Previous
                            </Button>
                            <span className="text-sm dark:text-gray-300">
                                Page {pageNumber} of {numPages || '--'}
                            </span>
                            <Button 
                                variant="outline" 
                                onClick={nextPage}
                                disabled={pageNumber >= (numPages || 0)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;