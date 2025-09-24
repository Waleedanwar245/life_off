'use client';

import { Form, Input, Select, Checkbox, Button, message, notification } from "antd"
import { FaTwitter, FaLinkedin, FaInstagram, FaPhone, FaEnvelope, FaFacebook, FaTiktok, FaPinterest } from "react-icons/fa"
import PATH from "../utils/path"
import GenericButton from "../GenericButton";
import { API_URL } from "../utils/BASE_URL";
import { toast } from "react-hot-toast"
import { FaMeta, FaX, FaXTwitter } from "react-icons/fa6";

const { TextArea } = Input

const ContactForm = () => {
    const [form] = Form.useForm()
    const onFinish = async (values: any) => {
        console.log("Form values:", values);

        try {
            debugger
            const response = await fetch(`${API_URL}/newsletter/contact-us/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const result = await response.json();

            if (response.ok) {
                console.log("Showing success toast");
                // message.success("✅ Email sent successfully!");
                toast.success('Your contact request has been sent to the administration.',
                );
                form.resetFields();
            } else {
                toast.error("❌ Failed to send email. Please try again.");
                console.error("Failed to send email:", result);
            }
        } catch (error) {
            toast.error("❌ Error submitting contact form. Please try again.");
            console.error("Error submitting contact form:", error);
        }
    };


    return (
        <>
            <div className="mt-[100px] max-w-[1000px] mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column - Form */}
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800  mt-[80px] md:mt-0 mb-8 text-center md:text-left">
                            Contact Us
                        </h1>
                        <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Form.Item
                                    name="firstName"
                                    label="First Name"
                                    rules={[{ required: true, message: "Please enter your first name" }]}
                                >
                                    <Input className="w-full p-2 border rounded" />
                                </Form.Item>

                                <Form.Item
                                    name="lastName"
                                    label="Last Name"
                                    rules={[{ required: true, message: "Please enter your last name" }]}
                                >
                                    <Input className="w-full p-2 border rounded" />
                                </Form.Item>
                            </div>

                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: "Please enter your email" },
                                    { type: "email", message: "Please enter a valid email" },
                                ]}
                            >
                                <Input className="w-full p-2 border rounded" />
                            </Form.Item>

                            <Form.Item
                                name="phone"
                                label="Phone"
                                rules={[{ required: true, message: "Please enter your phone number" }]}
                            >
                                <Input className="w-full p-2 border rounded" />
                            </Form.Item>

                            {/* <Form.Item
                                name="service"
                                label="Choose a service"
                                rules={[{ required: true, message: "Please select a service" }]}
                            >
                                <Select className="w-full">
                                    <Select.Option value="virtual-office">Virtual Office Spaces</Select.Option>
                                    <Select.Option value="meeting-rooms">Meeting Rooms</Select.Option>
                                    <Select.Option value="coworking">Coworking Spaces</Select.Option>
                                </Select>
                            </Form.Item> */}

                            <Form.Item
                                name="message"
                                label="Message"
                                rules={[{ required: true, message: "Please enter your message" }]}
                            >
                                <TextArea rows={4} className="w-full p-2 border rounded" />
                            </Form.Item>

                            <Form.Item>
                                <Checkbox required>
                                    I agree to the{" "}
                                    <a href={PATH.PRIVACY_POLICY_LANDING} className="text-[#7FA842] hover:text-[#7FA842]">
                                        Privacy Policy
                                    </a>
                                </Checkbox>
                            </Form.Item>

                            <Form.Item>
                                <Checkbox required>
                                    I agree to the{" "}
                                    <a href={PATH.TERM_AND_CONDITIONS} className="text-[#7FA842] hover:text-[#7FA842]">
                                        Terms and Conditions
                                    </a>
                                </Checkbox>
                            </Form.Item>

                            {/* reCAPTCHA would go here */}
                            <div className="mb-4">
                                {/* Replace with actual reCAPTCHA component */}
                                {/* <div className="border rounded p-4 bg-gray-50 text-center text-gray-500">reCAPTCHA</div> */}
                            </div>

                            <Form.Item>
                                <GenericButton
                                    variant="solid"
                                    htmlType="submit"
                                    className="w-full h-[45px] bg-[#7FA842] hover:bg-[#7FA842] text-white font-semibold py-2 px-4 rounded"
                                    label="Submit"

                                />
                                {/* <Button htmlType="submit">Submit</Button> */}
                            </Form.Item>
                        </Form>
                    </div>

                    {/* Right Column - Contact Info & Image */}
                    <div className="lg:pl-12">
                        <div className="mb-12">
                            <img
                                src={"/contact_form.svg"}
                                alt="Contact illustration"
                                className="w-full max-w-md mx-auto"
                            />
                        </div>

                        <div className="space-y-6">


                            <div className="flex items-center  space-x-3">
                                <div>

                                    <FaEnvelope className="text-[#7FA842] text-xl" />
                                </div>
                                <p className="font-semibold text-gray-800 mb-[0px]">info@LiveOffCoupon.com</p>
                            </div>

                            <div>
                                <p className="text-gray-600 mb-3">Follow us</p>
                                <div className="flex space-x-4">
                                    <a href="https://x.com/liveoff_coupon" target="_blank" className="text-[#7FA842] hover:text-[#7FA842]">
                                        <FaXTwitter  className="text-xl" />
                                    </a>
                                    <a href="https://www.facebook.com/liveoffcoupons/" target="_blank" className="text-[#7FA842] hover:text-[#7FA842]">
                                        <FaMeta className="text-xl" />
                                    </a>
                                    <a href="https://www.instagram.com/liveoffcoupon/" target="_blank" className="text-[#7FA842] hover:text-[#7FA842]">
                                        <FaInstagram className="text-xl" />
                                    </a>
                                    <a href="https://www.tiktok.com/@liveoffcoupon" target="_blank" className="text-[#7FA842] hover:text-[#7FA842]">
                                        <FaTiktok className="text-xl" />
                                    </a>
                                    <a href="https://www.pinterest.com/liveoffcoupon/" target="_blank" className="text-[#7FA842] hover:text-[#7FA842]">
                                        <FaPinterest className="text-xl" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ContactForm

