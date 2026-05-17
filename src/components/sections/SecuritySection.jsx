import { Card, Row, Col } from "antd";
import {
  SafetyOutlined,
  LockOutlined,
  KeyOutlined,
  FileProtectOutlined,
} from "@ant-design/icons";

const SecuritySection = () => {
  const securityFeatures = [
    {
      icon: <SafetyOutlined className="text-4xl" />,
      title: "Role-Based Access Control",
      description:
        "RBAC ensures users only access features and data relevant to their role, maintaining data integrity and privacy.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <LockOutlined className="text-4xl" />,
      title: "Secure Login & Authentication",
      description:
        "Multi-factor authentication and secure session management protect user accounts from unauthorized access.",
      color: "from-green-500 to-teal-500",
    },
    {
      icon: <KeyOutlined className="text-4xl" />,
      title: "Encrypted Data Storage",
      description:
        "All sensitive data is encrypted at rest and in transit using industry-standard encryption protocols.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <FileProtectOutlined className="text-4xl" />,
      title: "Protected Records",
      description:
        "Student and financial records are protected with advanced security measures and regular backups.",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <section
      id="security"
      className="w-full py-16 sm:py-20 lg:py-24 bg-linear-to-r from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Security & <span className="gradient-text">Data Protection</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Enterprise-grade security measures to protect your sensitive
            educational data
          </p>
        </div>

        {/* Security Features Grid */}
        <Row gutter={[16, 16]} className="sm:gutter-24">
          {securityFeatures.map((feature, index) => (
            <Col key={index} xs={24} lg={12}>
              <Card className="h-full hover-card-effect border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl bg-linear-to-r ${feature.color} flex items-center justify-center text-white shadow-lg`}>
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Security Standards */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <Card className="text-center bg-white hover-card-effect">
            <div className="text-5xl mb-4">🛡️</div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">
              Data Encryption
            </h4>
            <p className="text-gray-600 text-sm">
              AES-256 encryption for all sensitive data
            </p>
          </Card>
          <Card className="text-center bg-white hover-card-effect">
            <div className="text-5xl mb-4">🔐</div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">
              Secure Sessions
            </h4>
            <p className="text-gray-600 text-sm">
              JWT-based authentication with auto-expiry
            </p>
          </Card>
          <Card className="text-center bg-white hover-card-effect">
            <div className="text-5xl mb-4">📋</div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">Audit Logs</h4>
            <p className="text-gray-600 text-sm">
              Complete activity tracking and reporting
            </p>
          </Card>
        </div>

        {/* Compliance Banner */}
        <div className="mt-12">
          <Card className="bg-linear-to-r from-purple-600 to-indigo-600 text-white text-center border-0">
            <div className="text-2xl font-bold mb-2">
              🔒 Compliance & Standards
            </div>
            <p className="text-lg opacity-90">
              Built following industry best practices and security standards to
              ensure your educational data remains protected at all times.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
