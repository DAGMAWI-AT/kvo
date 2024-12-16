import { CarRentalRounded, GroupWorkRounded, PeopleAltOutlined, Report } from "@mui/icons-material";
import React from "react";
import { Circle } from "rc-progress";
import CountUp from "react-countup";

function CircleBar({ percentage }) {
  return (
    <section>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-5">
        {/* Card Item */}
        <div className="bg-white rounded-xl shadow-lg hover:scale-105 transition-transform duration-200">
          <div className="flex justify-between items-center px-5 py-5">
            <PeopleAltOutlined fontSize="large" className="text-black" />
            <div className="text-center">
              <Circle percent={70} strokeWidth={10} strokeColor="blue" trailWidth={8} trailColor="gold" />
              <div>
                <CountUp enableScrollSpy duration={2} end={percentage} />%
              </div>
            </div>
          </div>
          <div className="px-5 pb-5">
            <p className="text-blue-600 font-semibold text-left">Total Users</p>
            <p className="text-2xl text-black font-semibold text-left">
              <CountUp enableScrollSpy duration={2} end={100} />
            </p>
          </div>
        </div>

        {/* Repeat Card Item with Modified Content */}
        <div className="bg-white rounded-xl shadow-lg hover:scale-105 transition-transform duration-200">
          <div className="flex justify-between items-center px-5 py-5">
            <PeopleAltOutlined fontSize="large" className="text-black" />
            <div className="text-center">
              <Circle percent={60} strokeWidth={10} strokeColor="green" trailWidth={8} trailColor="red" />
              <div>
                <CountUp enableScrollSpy duration={2} end={percentage} />%
              </div>
            </div>
          </div>
          <div className="px-5 pb-5">
            <p className="text-blue-600 font-semibold text-left">Proposal</p>
            <p className="text-2xl text-black font-semibold text-left">
              <CountUp enableScrollSpy duration={2} end={100} />
            </p>
          </div>
        </div>

        {/* Additional Cards */}
        <div className="bg-white rounded-xl shadow-lg hover:scale-105 transition-transform duration-200">
          <div className="flex justify-between items-center px-5 py-5">
            <Report fontSize="large" className="text-black" />
            <div className="text-center">
              <Circle percent={60} strokeWidth={10} strokeColor="blue" trailWidth={8} trailColor="gold" />
              <div>
                <CountUp enableScrollSpy duration={2} end={60} />%
              </div>
            </div>
          </div>
          <div className="px-5 pb-5">
            <p className="text-blue-600 font-semibold text-left">Total Reports</p>
            <p className="text-2xl text-black font-semibold text-left">
              <CountUp enableScrollSpy duration={2} end={90} />
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg hover:scale-105 transition-transform duration-200">
          <div className="flex justify-between items-center px-5 py-5">
            <GroupWorkRounded fontSize="large" className="text-black" />
            <div className="text-center">
              <Circle percent={70} strokeWidth={10} strokeColor="blue" trailWidth={8} trailColor="gold" />
              <div>
                <CountUp enableScrollSpy duration={2} end={percentage} />%
              </div>
            </div>
          </div>
          <div className="px-5 pb-5">
            <p className="text-blue-600 font-semibold text-left">Projects</p>
            <p className="text-2xl text-black font-semibold text-left">
              <CountUp enableScrollSpy duration={2} end={70} />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CircleBar;
