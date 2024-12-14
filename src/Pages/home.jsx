import {useState} from 'react';
import {Button, Form, Input, Typography, message} from 'antd';

const {TextArea} = Input;
const {Title} = Typography;

const Home = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [markdownContent, setMarkdownContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onFinish = async (values) => {
        const { prompt, grade_level, topic } = values; // Get form field values

        setIsLoading(true);
        setMarkdownContent(''); // Clear previous content

        try {
            const response = await fetch('https://fiainv7nccbwodoqzxflt7aora0apzes.lambda-url.us-west-1.on.aws/api/lesson-plan', {
                method: 'POST', headers: {
                    'Content-Type': 'application/json',
                }, body: JSON.stringify({
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
                setMarkdownContent(content); // Update progressively
            }
        } catch (error) {
            messageApi.error(`An error occurred: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };


    return (<div style={{padding: '20px', maxWidth: '600px', margin: '0 auto'}}>
        {contextHolder}
        <Title level={2}>Lesson Plan Generator</Title>
        <Form
            layout="vertical"
            initialValues={{
                prompt: 'The rise and fall of the Roman Empire',
                grade_level: 8,
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

        <div style={{marginTop: '20px'}}>
            <div
                style={{
                    padding: '10px', whiteSpace: 'pre-wrap', overflowY: 'auto', maxHeight: '300px',
                }}>
                {markdownContent}
            </div>
        </div>
    </div>);
};

export default Home;