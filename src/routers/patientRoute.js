const Patient = require('../models/patients')
const express = require('express')
const router = express.Router()
const {SendDataToPatient} = require('../emails/accounts')
const Admin = require('../models/admin')
const auth = require('../middleware/auth')
const path = require('path')
const { ObjectID } = require('bson')

router.post('/admin/signup', async (req, res) => {
    if(req.body.login === process.env.ADMIN_LOG && req.body.password === process.env.ADMIN_PASS){
        try{
            const admin = new Admin(req.body)
            const token = await admin.generateAuthToken()
            res.cookie('auth_token', token)
            res.render('welcoming')
        } catch(e){
            res.render('error', {
                error: "Очень плохая мысль!"
            })
        }
    }else{
        const unableLogin = true
        res.render('register',{
            unableLogin
        })
    }
})

router.post('/admin/login', async (req, res) => {
    try{
        const admin = await Admin.findByCredentials(req.body.login, req.body.password)
        if(!admin){
            return res.status(404).send('Не найдено!')
        }
        const token = await admin.generateAuthToken()
        res.cookie('auth_token', token)
        res.render('welcoming')
    }catch (e) {
        const unableLogin = true
        res.render('index',{
            unableLogin
        })
    }
})

router.get('/admin/logout', auth, async (req, res) => {
    try{
        req.admin.tokens = req.admin.tokens = []
        await req.admin.save()
        res.render('error', {
            error: 'Вы успешно вышли из сети!'
        })
    }catch (e) {
        res.render('error', {
            error: e.message
        })
    }
})

router.get('/admin/patients/:page', auth, async (req, res) => {
    try{
        const mySort = {data: 1}
        const perPage = 10
        const page = parseInt(req.params.page) || 1
        const count = await Patient.countDocuments({})
        let noPagesPrev = true
        if(page <= 1){
            noPagesPrev = false
        }
        let noPagesNext = true
        if(page === (parseInt(count/perPage)) + 1){
            noPagesNext = false
        }
        const skip = ((perPage * page) -perPage)
        const patients = await Patient.find({}).sort(mySort).skip(skip).limit(perPage)
        res.render('patients',{
            patients,
            currentPage: page,
            pages: Math.ceil(count / perPage),
            nextPage: parseInt(req.params.page) + 1,
            prevPage: parseInt(req.params.page) - 1,
            noPagesPrev,
            noPagesNext
        })
    } catch (e) {
        res.status(400).send(e.message)
    }
})

router.get('/login', (req, res) => {
    res.render('index')
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/admin/patient', auth, async(req, res) => {
    try{
        const mySort = {data: 1}
        const patient = await Patient.find({name: req.query.name}).sort(mySort)
        if(patient.length === 0){
            const noPatients = true
            return res.render('patient', {
                noPatients
            })
        }
        res.render('patient',{
            patient
        })
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get('/admin/patient/date', auth, async (req, res) => {
    const patients = await Patient.find({})
    const neededPatients = []
    let noPatients = false
    await patients.forEach(element => {
        if(element.data.includes(req.query.data)){
            neededPatients.push(element)
        }
    });
    if(neededPatients.length === 0){
        noPatients = true
    }
    await neededPatients.sort()
    res.render('patient', {
        neededPatients,
        noPatients
    })
})

router.get('/admin/edit/:id', auth, async (req, res) => {
    try{
        const patient = await Patient.findById(req.params.id)
        res.render('edit',{
            patient
        })
    }catch (e) {
        res.status(500).send(e.message)
    }
})

router.get('/admin/find/patient', auth, (req, res) => {
    res.render('patient')
})

router.post('/admin/patient/update/:id', auth, async (req, res) => {
    try{
        const patient = await Patient.findById(req.params.id)
        await patient.updateOne(req.body)
        res.redirect('/admin/patients/1')
    }catch(e) {
        res.status(500).send(e.message)
    }
})

router.get('/admin/patient/delete/:id', auth, async (req, res) => {
    try{
        const patient = await Patient.findById(req.params.id)
        if(!patient){
            return res.status(404).send('Пациент не найден!')
        }
        await patient.remove()
        res.redirect(req.get('referer'))
    }catch (e) {
        res.status(500).send(e.message)
    }
})

router.get('/', (req, res) => {
    res.render('index.html')
})

router.get('/pateint/appointment', async (req ,res) => {
    try {
        const patients = await Patient.find({phone: req.query.phoneCheck})
        if(patients.length === 0) {
            throw new Error('Записей на этот номер оформлено не было!')
        }
        res.render('patientAppointments', {
            patient: patients
        })
    } catch (e) {
        res.render('error', {
            error: e.message
        })
    }
})

router.post('/patient/delete/appointment/:id', async (req, res) => {
    try{
        const patient = await Patient.findById(req.params.id)
        if(!patient) {
            throw new Error('Такой записи не существует!')
        }
        await patient.remove()
        res.redirect(req.get('referer'))
    }catch (e) {
        res.render('error', {
            error: e.message
        })
    }
})

router.post('/registration', async (req, res) => {
    try{
        const patientExists = await Patient.findOne({data: req.body.data})
        if(patientExists){
            const error = 'Такая запись уже существует!'
            const patients = await Patient.find({})
            let availableHours = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00']
            const busyDate = []
            await patients.forEach(element => {
                if(element.data.includes(req.body.data.split(' ')[0])){
                    busyDate.push(element.data.slice(-5))
                }
            });
            busyDate.sort()

            await busyDate.forEach(element => {
                availableHours = availableHours.filter((hour) => hour !== element)
            })

            let full = false
            if(availableHours.length === 0) {
                full = true
            }
            if(patients){
                return res.render('availableDate',{
                    error,
                    full,
                    patients: availableHours,
                    data: req.body.data.split(' ')[0],
                })
            }
        }
        if(!req.body.data){
            throw new Error('Вы не указали дату!')
        }

        if(!req.body.data && !req.body.phone) throw new Error('Вы не указали телефон и дату!')

        if(!req.body.phone) throw new Error('Вы не указали телефон!')
        const patient = await new Patient(req.body)
        await patient.save()
        //SendDataToPatient(patient.email, patient.name, patient.data)
        res.render('appointment',{
            patient
        })
    } catch (e) {
        res.render('error', {
            error: e.message
        })
    }
})

router.post('/admin/patients/delete/oldPatients', auth, async (req, res) => {
    try {
        const patients = await Patient.find()
        const rightFormat = new Date().toLocaleDateString().split('.')
        const today = Date.parse(new Date(`${+rightFormat[2]}, ${+rightFormat[1]}, ${+rightFormat[0] + 1}`))
        patients.forEach(async (patient) => {
            const patientData = patient.data.split(' ')[0].split('.')
            const patientDataMS =  Date.parse(new Date(`${+patientData[2]}, ${+patientData[1]}, ${+patientData[0] + 1}`))
            if(today > patientDataMS) {
                patient.data = 1
                await patient.save()
            }
        })
        await Patient.deleteMany({date: 1})
        res.redirect(req.get('referer'))
    } catch (e) {
        res.status(500).send(e.message)
    }
})

router.get('/*', (req, res) => {
    res.render('error', {
        error: 'Такой страницы не существует'
    })
})

module.exports = router