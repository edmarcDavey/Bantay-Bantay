
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

export default function Dashboard() {
    const [permission, setPermission] = useState('');
    const [location, setLocation] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
                setPermission(result.state);
                result.onchange = function () {
                    setPermission(result.state);
                    if (result.state === 'granted') {
                        requestLocation();
                    } else {
                        setLocation(null);
                    }
                };
            });
        }
    }, []);

    const requestLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setLocation({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                    });
                    setError('');
                },
                (err) => {
                    setError(err.message);
                    setLocation(null);
                }
            );
        } else {
            setError('Geolocation is not supported by your browser.');
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div>You're logged in!</div>
                            <div className="mt-4">
                                <strong>Location Permission:</strong> {permission}
                            </div>
                            <button
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                                onClick={requestLocation}
                            >
                                Detect Location
                            </button>
                            {location && (
                                <div className="mt-2">
                                    <strong>Latitude:</strong> {location.lat} <br />
                                    <strong>Longitude:</strong> {location.lng}
                                </div>
                            )}
                            {error && (
                                <div className="mt-2 text-red-500">{error}</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
