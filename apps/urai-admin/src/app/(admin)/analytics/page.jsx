'use client';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { useEffect, useState, useMemo } from 'react';
import { DatePicker } from '@/components/analytics/DatePicker';
import { MetricCard } from '@/components/analytics/MetricCard';
import { EventsTable } from '@/components/analytics/EventsTable';
// Helper to get a date string in YYYY-MM-DD format for yesterday
var getYesterdayDateString = function () {
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
};
export default function AnalyticsDashboard() {
    var _a, _b, _c, _d, _e, _f;
    var _g = useState(null), data = _g[0], setData = _g[1];
    var _h = useState(null), error = _h[0], setError = _h[1];
    var _j = useState(true), isLoading = _j[0], setIsLoading = _j[1];
    var _k = useState(getYesterdayDateString()), selectedDate = _k[0], setSelectedDate = _k[1];
    var maxDate = useMemo(function () { return getYesterdayDateString(); }, []);
    useEffect(function () {
        function fetchData(date) {
            return __awaiter(this, void 0, void 0, function () {
                var res, json, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            setIsLoading(true);
                            setError(null);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, 5, 6]);
                            return [4 /*yield*/, fetch("/api/admin/analytics?date=".concat(date))];
                        case 2:
                            res = _a.sent();
                            if (!res.ok) {
                                throw new Error("Failed to fetch data: ".concat(res.status, " ").concat(res.statusText));
                            }
                            return [4 /*yield*/, res.json()];
                        case 3:
                            json = _a.sent();
                            setData(json);
                            return [3 /*break*/, 6];
                        case 4:
                            e_1 = _a.sent();
                            setError(e_1.message);
                            setData(null); // Clear previous data on error
                            return [3 /*break*/, 6];
                        case 5:
                            setIsLoading(false);
                            return [7 /*endfinally*/];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        }
        fetchData(selectedDate);
    }, [selectedDate]);
    var totalEvents = useMemo(function () {
        var _a;
        if (!((_a = data === null || data === void 0 ? void 0 : data.events) === null || _a === void 0 ? void 0 : _a.counts))
            return 0;
        return Object.values(data.events.counts).reduce(function (a, b) { return a + b; }, 0);
    }, [data]);
    return (<div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} maxDate={maxDate}/>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!isLoading && !error && data && (<div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <MetricCard title="Daily Active Users (DAU)" value={(_b = (_a = data.dau) === null || _a === void 0 ? void 0 : _a.count) !== null && _b !== void 0 ? _b : 0} description={"for ".concat((_c = data.dau) === null || _c === void 0 ? void 0 : _c.date)}/>
             <MetricCard title="Total Events" value={totalEvents} description={"for ".concat((_d = data.events) === null || _d === void 0 ? void 0 : _d.date)}/>
          </div>
          <EventsTable data={(_f = (_e = data.events) === null || _e === void 0 ? void 0 : _e.counts) !== null && _f !== void 0 ? _f : {}}/>
        </div>)}
    </div>);
}
