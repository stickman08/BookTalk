exports.parseError = (err) => {
    const errors = {
        messages: [],
    };

    if (Array.isArray(err)) {
        err.forEach(e => {
            errors.messages.push(e.msg);
        });
    } else if (err.name == 'ValidatorError') {
        for (const [field, e] of Object.entries(err.errors)) {
            errors.messages.push(e.message);
        }
    } else {
        errors.messages.push(err.message);
    }
    // console.log(errors);
    return errors;
}
