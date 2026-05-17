import { Card, Row, Col } from "antd";
import {
  ThunderboltOutlined,
  LineChartOutlined,
  CommentOutlined,
  BarChartOutlined,
  RiseOutlined,
  SafetyOutlined,
} from "@ant-design/icons";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: <ThunderboltOutlined />,
      title: "Reduces Administrative Workload",
      description:
        "Automate repetitive tasks and streamline operations, freeing up staff time for more important activities",
      linear: "from-yellow-500 to-orange-500",
    },
    {
      icon: <LineChartOutlined />,
      title: "Improves Academic Monitoring",
      description:
        "Track student progress in real-time with detailed analytics and performance insights",
      linear: "from-blue-500 to-cyan-500",
    },
    {
      icon: <CommentOutlined />,
      title: "Enhances Communication",
      description:
        "Foster better parent-school-student relationships with instant notifications and updates",
      linear: "from-green-500 to-teal-500",
    },
    {
      icon: <BarChartOutlined />,
      title: "Data-Driven Decisions",
      description:
        "Make informed decisions based on comprehensive analytics and AI-powered insights",
      linear: "from-purple-500 to-pink-500",
    },
    {
      icon: <RiseOutlined />,
      title: "Scalable Solution",
      description:
        "Grows with your institution from small schools to large educational organizations",
      linear: "from-indigo-500 to-purple-500",
    },
    {
      icon: <SafetyOutlined />,
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security ensures your data is always protected and accessible",
      linear: "from-red-500 to-pink-500",
    },
  ];

  return (
    <section
      id="benefits"
      className="w-full py-16 sm:py-20 lg:py-24 bg-linear-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose <span className="linear-text">SSMS</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your educational institution with these powerful benefits
          </p>
        </div>

        {/* Benefits Grid */}
        <Row gutter={[16, 16]} className="sm:gutter-24">
          {benefits.map((benefit, index) => (
            <Col key={index} xs={24} sm={12} lg={8}>
              <Card className="h-full hover-card-effect border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 group">
                <div className="text-center space-y-4">
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-linear-to-r ${benefit.linear} flex items-center justify-center text-white text-3xl sm:text-4xl shadow-lg group-hover:scale-110 transition-transform shrink-0`}>
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Impact Stats */}
        <div className="mt-12 sm:mt-16">
          <Card className="bg-linear-to-r from-purple-600 to-indigo-600 text-white border-0 shadow-xl">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-3">Measurable Impact</h3>
              <p className="text-lg opacity-90">
                See the difference SSMS can make in your institution
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">70%</div>
                <div className="text-sm opacity-90">
                  Time Saved on Admin Tasks
                </div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">95%</div>
                <div className="text-sm opacity-90">
                  Parent Satisfaction Rate
                </div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">80%</div>
                <div className="text-sm opacity-90">Improved Communication</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold mb-2">100%</div>
                <div className="text-sm opacity-90">Data Accuracy</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Testimonial */}
        <div className="mt-12">
          <Card className="max-w-4xl mx-auto border-2 border-purple-100">
            <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6">
              <div className="shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-linear-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold">
                  💼
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <p className="text-lg text-gray-700 italic mb-4">
                  "SSMS has completely transformed how we manage our school. The
                  AI-powered insights help us identify and support at-risk
                  students early, and the automation has saved countless hours
                  of administrative work."
                </p>
                <div className="font-bold text-gray-900">
                  School Administrator
                </div>
                <div className="text-sm text-gray-600">
                  Final Year Project Evaluator
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
