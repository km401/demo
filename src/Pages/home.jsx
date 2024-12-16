import {useState} from 'react';
import {Button, Form, Input, Typography, message, Skeleton} from 'antd';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './pages.css';

const {TextArea} = Input;
const {Title} = Typography;


const Home = () => {
    const [responses, setResponses] = useState([]); // Store all responses
    const [isLoading, setIsLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();


    const onFinish = async (values) => {
        const { prompt, grade_level, topic } = values; // Get form field values

        setIsLoading(true);

        try {
            const response = await fetch('https://d2qqqlxkk5723k.cloudfront.net/api/lesson-plan-with-assistant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                body: JSON.stringify({
                    prompt, grade_level, topic,
                }),
            });

            if (!response.ok) {
                console.error(`HTTP Error: ${response.status}`);
                const errorDetails = await response.text();
                console.error('Error Details:', errorDetails);
                throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorDetails}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let content = '';

            while (true) {
                const {done, value} = await reader.read();
                if (done) break;

                content += decoder.decode(value, {stream: true});
            }
            setResponses((prevResponses) => [
                ...prevResponses,
                {
                    prompt,
                    grade_level,
                    topic,
                    content,
                },
            ]);
        } catch (error) {
            messageApi.error(`An error occurred: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };


    return (<div className={'homeContainer'}>
        {contextHolder}
        <Title level={2}>Lesson Plan Generator</Title>
        <Form
            layout="vertical"
            initialValues={{
                prompt: 'The rise and fall of the Roman Empire',
                grade_level: '8',
                topic: 'History',
            }}
            onFinish={onFinish}>
            <Form.Item
                label="Prompt"
                name="prompt"
                rules={[{required: true, message: 'Please enter a prompt!'}]}>
                <TextArea
                    placeholder="Enter the prompt" />
            </Form.Item>

            <Form.Item
                label="Grade Level"
                name="grade_level"
                rules={[{required: true, message: 'Please enter the grade level!'}]}>
                <Input
                    placeholder="Enter the grade level"
                />
            </Form.Item>

            <Form.Item
                label="Topic"
                name="topic"
                rules={[{required: true, message: 'Please enter a topic!'}]}>
                <Input
                    placeholder="Enter the topic" />
            </Form.Item>

            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={isLoading}>
                    {isLoading ? 'Generating...' : 'Generate Lesson Plan'}
                </Button>
            </Form.Item>
        </Form>

        <div style={{ marginTop: '20px' }}>
            <div className="responseContainer">
                {isLoading && responses.length === 0 && <Skeleton active />}
                {responses.map((response, index) => (
                    <div key={index} className="responseBlock">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {`**Prompt:** ${response.prompt}\n\n**Grade Level:** ${response.grade_level}\n\n**Topic:** ${response.topic}\n\n${response.content}`}
                        </ReactMarkdown>
                        <hr />
                    </div>
                ))}
            </div>
        </div>
    </div>);
};

export default Home;