import { Form, Input, Button, message } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  RocketOutlined,
  SafetyOutlined,
  TeamOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;

const ContactSection = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Contact form values:", values);
    message.success(
      "Thank you for your interest! We will get back to you soon.",
    );
    form.resetFields();
  };

  const contactInfo = [
    {
      icon: <MailOutlined />,
      title: "Email Us",
      content: "support@ssms.edu",
      description: "Send us your queries anytime",
      color: "#3b82f6",
      bgColor: "#eff6ff",
    },
    {
      icon: <PhoneOutlined />,
      title: "Call Us",
      content: "+1 (555) 123-4567",
      description: "Mon-Fri from 8am to 6pm",
      color: "#10b981",
      bgColor: "#ecfdf5",
    },
    {
      icon: <EnvironmentOutlined />,
      title: "Visit Us",
      content: "123 Education Street",
      description: "Learning City, LC 12345",
      color: "#f59e0b",
      bgColor: "#fef3c7",
    },
    {
      icon: <ClockCircleOutlined />,
      title: "Office Hours",
      content: "8:00 AM - 6:00 PM",
      description: "Monday to Friday",
      color: "#8b5cf6",
      bgColor: "#f5f3ff",
    },
  ];

  const features = [
    {
      icon: <RocketOutlined />,
      label: "AI Powered",
      color: "#3b82f6",
    },
    {
      icon: <SafetyOutlined />,
      label: "Secure & Safe",
      color: "#10b981",
    },
    {
      icon: <TeamOutlined />,
      label: "500+ Schools",
      color: "#f59e0b",
    },
    {
      icon: <GlobalOutlined />,
      label: "24/7 Support",
      color: "#8b5cf6",
    },
  ];

  return (
    <section
      id="contact"
      className="w-full py-16 sm:py-20 lg:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm mb-4">
            <PhoneOutlined />
            <span>Get In Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Contact <span className="text-indigo-600">Us</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Have questions about SSMS? We'd love to hear from you and help you
            get started
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 group">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: info.bgColor, color: info.color }}>
                <span className="text-2xl">{info.icon}</span>
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{info.title}</h3>
              <p className="font-semibold text-slate-700 mb-1">
                {info.content}
              </p>
              <p className="text-sm text-slate-500">{info.description}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Send us a Message
              </h3>
              <p className="text-slate-600 mb-6">
                Fill out the form below and we'll get back to you within 24
                hours
              </p>
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Form.Item
                    label={
                      <span className="font-semibold text-slate-700">
                        Full Name
                      </span>
                    }
                    name="name"
                    rules={[
                      { required: true, message: "Please enter your name" },
                    ]}>
                    <Input
                      size="large"
                      placeholder="John Doe"
                      className="rounded-xl"
                    />
                  </Form.Item>

                  <Form.Item
                    label={
                      <span className="font-semibold text-slate-700">
                        Email Address
                      </span>
                    }
                    name="email"
                    rules={[
                      { required: true, message: "Please enter your email" },
                      { type: "email", message: "Please enter a valid email" },
                    ]}>
                    <Input
                      size="large"
                      placeholder="john@example.com"
                      className="rounded-xl"
                    />
                  </Form.Item>
                </div>

                <Form.Item
                  label={
                    <span className="font-semibold text-slate-700">
                      Subject
                    </span>
                  }
                  name="subject"
                  rules={[{ required: true, message: "Please enter subject" }]}>
                  <Input
                    size="large"
                    placeholder="Inquiry about SSMS"
                    className="rounded-xl"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="font-semibold text-slate-700">
                      Message
                    </span>
                  }
                  name="message"
                  rules={[
                    { required: true, message: "Please enter your message" },
                  ]}>
                  <TextArea
                    rows={5}
                    placeholder="Tell us about your inquiry..."
                    size="large"
                    className="rounded-xl"
                  />
                </Form.Item>

                <Form.Item className="mb-0">
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    className="h-12 text-base font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700">
                    Send Message
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Project */}
            <div className="bg-white rounded-2xl p-6 border-2 border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                About SSMS
              </h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Smart School Management System is an AI-powered platform
                designed to streamline academic, administrative, and financial
                processes in educational institutions.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                  <span className="text-slate-700">Academic Project</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                  <span className="text-slate-700">Educational Purpose</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-amber-600"></div>
                  <span className="text-slate-700">Modern Tech Stack</span>
                </div>
              </div>
            </div>

            {/* Quick Features */}
            <div className="bg-indigo-600 rounded-2xl p-6 text-white">
              <h4 className="font-bold text-lg mb-4">Why Choose SSMS?</h4>
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg shrink-0">
                      {feature.icon}
                    </div>
                    <span className="font-medium">{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-emerald-50 rounded-2xl p-6 border-2 border-emerald-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-xl shrink-0">
                  <ClockCircleOutlined />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">
                    Quick Response
                  </h4>
                  <p className="text-sm text-slate-600">
                    We typically respond to all inquiries within 24 hours during
                    business days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
