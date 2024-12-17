import {useState} from 'react';
import {Button, Form, Input, Typography, message, Skeleton, Space} from 'antd';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './pages.css';
import {downloadWordDocument} from './helpers.jsx'

const {TextArea} = Input;
const {Title} = Typography;


const Home = () => {
    const [responses, setResponses] = useState([]); // Store all responses
    const [streamingContent, setStreamingContent] = useState(''); // For progressive rendering
    const [isLoading, setIsLoading] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [formValues, setFormValues] = useState({ prompt: '', grade_level: '', topic: '' });

    const onFinish = async (values) => {
        const { prompt, grade_level, topic } = values; // Get form field values
        setFormValues(values);


        setIsLoading(true);
        setStreamingContent(''); // Clear streaming content

        try {
            const response = await fetch('https://development.classo.ai/api/lesson-plan-with-assistant', {
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
                setStreamingContent(content); // Update progressively
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
            setStreamingContent(''); // Clear the streaming content once complete
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
                    placeholder="Enter the prompt"/>
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
                    placeholder="Enter the topic"/>
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
            <div className={(responses.length > 0 || streamingContent || isLoading) ? 'responseContainer' : ''}>

                {/* Render completed responses */}
                {responses.map((response, index) => (
                    <div key={index} className="responseBlock">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {`**Prompt:** ${response.prompt}
                            **Grade Level:** ${response.grade_level}
                            **Topic:** ${response.topic}\n\n${response.content}`}
                        </ReactMarkdown>
                    </div>
                ))}

                {(isLoading && !streamingContent) && <Skeleton active />}

                {/* Render streaming content with current form data */}
                {streamingContent && (
                    <div className="responseBlock streaming">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {`**Prompt:** ${formValues.prompt}
                            **Grade Level:** ${formValues.grade_level}
                            **Topic:** ${formValues.topic}\n\n${streamingContent}`}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
        {responses.length > 0 &&
            <Space className="downloadWord">
                <Button type="primary" onClick={() => downloadWordDocument(responses)}>
                    Download as Word
                </Button>
            </Space>
        }
    </div>);
};

export default Home;