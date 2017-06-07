<?php
// No direct access to this file
defined('_JEXEC') or die('Restricted access');

// import Joomla modelitem library
jimport('joomla.application.component.modelitem');


class ImmoBrowseModelExpose extends JModelItem
{
    protected $customer;
    protected $hisecon_config
    protected $sitekey;

    public function getTable($type = 'Config', $prefix = 'ImmoBrowseTable', $config = array())
    {
        return JTable::getInstance($type, $prefix, $config);
    }

    public function getCustomer($cid)
    {
        if (! is_array($this->customer))
        {
            $this->customer = array();
        }

        if (! isset($this->customer[$cid]))
        {
            $jinput = JFactory::getApplication()->input;
            $cid = $jinput->get('customer', 1, 'INT');
            $table = $this->getTable();
            $table->load($cid);
            $this->customer[$cid] = $table->customer;
        }

        return $this->customer[$cid];
    }

    public function getSitekey($cid)
    {
        if (! is_array($this->hisecon_config))
        {
            $this->hisecon_config = array();
        }

        if (! isset($this->hisecon_config[$cid]))
        {
            $jinput = JFactory::getApplication()->input;
            $cid = $jinput->get('customer', 1, 'INT' );
            $table = $this->getTable();
            $table->load($cid);
            $this->hisecon_config[$cid] = $table->hisecon_config;
        }

        return $this->hisecon_config[$cid];
    }

    public function getHiseconConfig($cid)
    {
        if (! is_array($this->sitekey))
        {
            $this->sitekey = array();
        }

        if (! isset($this->sitekey[$cid]))
        {
            $jinput = JFactory::getApplication()->input;
            $cid = $jinput->get('customer', 1, 'INT' );
            $table = $this->getTable();
            $table->load($cid);
            $this->sitekey[$cid] = $table->sitekey;
        }

        return $this->sitekey[$cid];
    }

    public function getObjectId()
    {
        return JRequest::getVar('objectId');
    }
}
?>
