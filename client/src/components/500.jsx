import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Head from 'next/head';

const Custom500 = () => {
  const router = useRouter();

  useEffect(() => {
    // Auto-retry logic after 10 seconds
    const timer = setTimeout(() => {
      window.location.reload();
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleRetry = () => {
    router.reload();
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>500 - Server Error | ResultAayo</title>
      </Head>
      
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full"
        >
          <div className="text-center">
            <motion.h1 
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0] 
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl font-bold text-red-500 mb-8"
            >
              500
            </motion.h1>
            
            <h2 className="text-2xl font-semibold text-white mb-4">
              Server Error
            </h2>
            
            <p className="text-gray-300 mb-8">
              We're experiencing some technical difficulties. 
              Our team has been notified and we're working to fix it.
              The page will automatically retry in 10 seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRetry}
                className="px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Try Again Now
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGoHome}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Back to Home
              </motion.button>
            </div>

            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-8 text-gray-400"
            >
              <div className="inline-block animate-spin mr-2">⚙️</div>
              Auto-retrying...
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Custom500;
