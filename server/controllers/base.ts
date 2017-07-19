abstract class BaseCtrl {

  abstract model: any;

  // Get all
  getAll = (req, res) => {
    this.model.find({}, (err, docs) => {
      if (err) {
        console.error(err);
        res.status(500).json({code: 500, message: 'Error to getAll model ' + this.model.modelName});
      } else {
        res.json(docs);
      }
    });
  };

  // Count all
  count = (req, res) => {
    this.model.count((err, count) => {
      if (err) {
        console.error(err);
        res.status(500).json({code: 500, message: 'Error to count model ' + this.model.modelName});
      } else {
        res.json(count);
      }
    });
  };

  // Insert
  insert = (req, res) => {
    const obj = new this.model(req.body);
    obj.save((err, item) => {
      // 11000 is the code for duplicate key error
      if (err && err.code === 11000) {
        res.sendStatus(400);
      }
      if (err) {
        console.error(err);
        res.status(500).json({code: 500, message: 'Error to insert model ' + this.model.modelName});
      } else {
        res.status(200).json(item);
      }
    });
  };

  // Get by id
  get = (req, res) => {
    this.model.findOne({ _id: req.params.id }, (err, obj) => {
      if (err) {
        console.error(err);
        res.status(500).json({code: 500, message: 'Error to get model ' + this.model.modelName});
      } else {
        res.json(obj);
      }
    });
  };

  // Update by id
  update = (req, res) => {
    this.model.findOneAndUpdate({ _id: req.params.id }, req.body, (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({code: 500, message: 'Error to update model ' + this.model.modelName});
      } else {
        res.status(200).json({code: 200, message: 'Update success'});
      }
    });
  };

  // Delete by id
  delete = (req, res) => {
    this.model.findOneAndRemove({ _id: req.params.id }, (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({code: 500, message: 'Error to delete model ' + this.model.modelName});
      } else {
        res.status(200).json({code: 200, message: 'Delete success'});
      }
    });
  };

  list = (req, res) => {
    const perPage: number = req.params.limit || 10;
    const page: number = Math.max(0, req.params.page);
    const sortTemp = req.params.sort || '';
    const sortList = new Object();
    sortTemp.split(',').forEach(function(element) {
        const e = element.split(':');
        sortList[e[0]] = <number>e[1];
    });

    this.model.find()
    .sort(sortList)
    .skip(page * perPage)
    .limit(+perPage)
    .exec(function (err, obj) {
      if (err) {
        console.error(err);
        res.status(500).json({code: 500, message: 'Error to list model ' + this.model.modelName});
      } else {
        res.json(obj);
      }
    });
  };
}

export default BaseCtrl;
