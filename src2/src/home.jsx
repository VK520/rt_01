import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const isUserLoggedIn = () => {
    return localStorage.getItem('token') ? true : false;
};
const Home = () => {
    const navigate = useNavigate();
    const handleWriteArticle = () => {
        if (!isUserLoggedIn()) {
            toast.error('请先登录后再发布文章！', {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            setTimeout(() => {
                navigate('/login', { replace: true });
            }, 2000);
            return;
        }
        navigate('/publish');
    };
    return (
        <div style={{ padding: '20px' }}>
            <button onClick={handleWriteArticle}>写文章</button>
            <ToastContainer />
        </div>
    );
};

export default Home;