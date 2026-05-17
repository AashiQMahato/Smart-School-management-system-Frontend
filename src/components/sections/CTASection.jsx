import { Button, Card } from "antd";
import { ArrowRightOutlined, RocketOutlined } from "@ant-design/icons";

const CTASection = () => {
  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 bg-linear-to-r from-purple-600 via-indigo-600 to-purple-600 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Card className="max-w-5xl mx-auto bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <div className="text-center space-y-6 sm:space-y-8 p-6 sm:p-8">
            <div className="inline-flex items-center gap-3 bg-purple-100 px-6 py-3 rounded-full">
              <RocketOutlined className="text-2xl text-purple-600" />
              <span className="font-bold text-purple-600">
                Final Year Project 2026
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
              Ready to Transform{" "}
              <span className="gradient-text">School Management</span>?
            </h2>

            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Experience the future of education management with SSMS. Our
              AI-powered platform streamlines operations, enhances
              communication, and improves educational outcomes.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4">
              <Button
                type="primary"
                size="large"
                className="h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg font-semibold"
                icon={<ArrowRightOutlined />}>
                Explore Features
              </Button>
              <Button
                size="large"
                className="h-12 sm:h-14 px-8 sm:px-10 text-base sm:text-lg font-semibold border-2 border-purple-600 text-purple-600 hover:bg-purple-50">
                Request Demo
              </Button>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-3xl font-bold gradient-text">AI</div>
                  <div className="text-sm text-gray-600">Powered</div>
                </div>
                <div>
                  <div className="text-3xl font-bold gradient-text">100%</div>
                  <div className="text-sm text-gray-600">Secure</div>
                </div>
                <div>
                  <div className="text-3xl font-bold gradient-text">24/7</div>
                  <div className="text-sm text-gray-600">Available</div>
                </div>
                <div>
                  <div className="text-3xl font-bold gradient-text">∞</div>
                  <div className="text-sm text-gray-600">Scalable</div>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-500 pt-4">
              <p>
                Academic Project • Educational Use • Built with Modern
                Technologies
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default CTASection;
