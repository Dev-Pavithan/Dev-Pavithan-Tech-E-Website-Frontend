import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './package.css';
import { useTranslation } from 'react-i18next'; // Import the translation hook

export default function PackageManagement() {
    const { t } = useTranslation(); // Initialize the translation function
    const [packages, setPackages] = useState([]);
    const [form, setForm] = useState({
        name: '',
        version: '',
        description: '',
        price: '',
        images: null,
    });
    const [editingPackage, setEditingPackage] = useState(null);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const response = await axios.get('http://localhost:7100/api/packages');
            setPackages(response.data);
        } catch (error) {
            console.error('Error fetching packages:', error);
            setError(t('Failed to Fetch Packages')); // Use translation
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleFileChange = (e) => {
        setForm({ ...form, images: e.target.files });
    };

    const createPackage = async () => {
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('version', form.version);
        formData.append('description', form.description);
        formData.append('price', form.price);
        for (let i = 0; i < form.images.length; i++) {
            formData.append('images', form.images[i]);
        }

        try {
            await axios.post('http://localhost:7100/api/packages', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            await fetchPackages();
            resetForm();
            setShowForm(false);
        } catch (error) {
            console.error('Error creating package:', error);
            setError(t('Failed to Create Package')); // Use translation
        }
    };

    const updatePackage = async () => {
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('version', form.version);
        formData.append('description', form.description);
        formData.append('price', form.price);
        if (form.images) {
            for (let i = 0; i < form.images.length; i++) {
                formData.append('images', form.images[i]);
            }
        }

        try {
            await axios.put(`http://localhost:7100/api/packages/${editingPackage._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            await fetchPackages();
            resetForm();
        } catch (error) {
            console.error('Error updating package:', error);
            setError(t('Failed to Update Package')); // Use translation
        }
    };

    const startEditing = (pkg) => {
        setEditingPackage(pkg);
        setForm({
            name: pkg.name,
            version: pkg.version,
            description: pkg.description,
            price: pkg.price,
            images: null,
        });
        setShowForm(true);
    };

    const deletePackage = async (id) => {
        try {
            await axios.delete(`http://localhost:7100/api/packages/${id}`);
            fetchPackages();
        } catch (error) {
            console.error('Error deleting package:', error);
            setError(t('Failed to Delete Package')); // Use translation
        }
    };

    const resetForm = () => {
        setEditingPackage(null);
        setForm({ name: '', version: '', description: '', price: '', images: null });
        setShowForm(false);
        setError(null);
    };

    return (
        <div className="PackageManagement container mt-5">
            <h1 className="text-center mb-5">{t('Manage Packages')}</h1>

            <div className="d-flex justify-content-end mb-4">
                {!showForm && (
                    <button
                        className="create-package-btn"
                        onClick={() => {
                            resetForm();
                            setShowForm(true);
                        }}
                    >
                        {t('Create Package')} {/* Use translation */}
                    </button>
                )}
            </div>

            {showForm ? (
                <div className="card mb-4">
                    <div className="card-body">
                        <h3>{editingPackage ? t('Edit Package') : t('Add New Package')}</h3>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form>
                            <div className="form-group">
                                <label htmlFor="name">{t('Name')}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="version">{t('Version')}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="version"
                                    name="version"
                                    value={form.version}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">{t('Description')}</label>
                                <textarea
                                    className="form-control"
                                    id="description"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label htmlFor="price">{t('Price')}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="price"
                                    name="price"
                                    value={form.price}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="images">{t('Images')}</label>
                                <input
                                    type="file"
                                    className="form-control-file"
                                    id="images"
                                    name="images"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className="button-wrapper">
                                <button
                                    type="button"
                                    className="btn btn-secondary go-back-btn"
                                    onClick={resetForm}
                                >
                                    {t('Go Back')} {/* Use translation */}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary add-package-btn"
                                    onClick={editingPackage ? updatePackage : createPackage}
                                >
                                    {editingPackage ? t('Update Package') : t('Add Package')} {/* Use translation */}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="card">
                    <div className="card-body">
                        <h3 className="card-title">{t('Available Packages')}</h3>
                        <div className="packages-list">
                            {packages.length > 0 ? (
                                <ul className="list-group">
                                    {packages.map((pkg) => (
                                        <li key={pkg._id} className="list-group-item d-flex align-items-start">
                                            <div className="flex-grow-1" style={{ maxWidth: '50%' }}>
                                                <strong>{pkg.name}</strong> - {pkg.version}
                                                <br />
                                                {pkg.description}
                                            </div>
                                            <div className="text-center flex-grow-0 mx-3">
                                                {pkg.images && pkg.images.length > 0 && (
                                                    <img
                                                        src={pkg.images[0]} // Display only the first image
                                                        alt={`Package Image`}
                                                        className="img-thumbnail"
                                                    />
                                                )}
                                            </div>
                                            <div className="d-flex flex-column align-items-end">
                                                <button
                                                    className="btn btn-sm btn-edit mb-2"
                                                    onClick={() => startEditing(pkg)}
                                                >
                                                    {t('Edit')} {/* Use translation */}
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-delete"
                                                    onClick={() => deletePackage(pkg._id)}
                                                >
                                                    {t('Disable')} {/* Use translation */}
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>{t('No Packages Found')}</p> // Use translation
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
