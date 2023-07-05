import { CircularProgress } from '@chakra-ui/react';

const Loading = (props) => {
    return (
        <div className='f-center pad-top--2rem'>
            <CircularProgress isIndeterminate size='100px' color='black' />
        </div>
    )
};

export default Loading;

