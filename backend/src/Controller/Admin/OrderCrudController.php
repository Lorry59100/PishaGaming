<?php

namespace App\Controller\Admin;

use App\Entity\Order;
use App\Form\OrderDetailsType;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\CollectionField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IntegerField;
use EasyCorp\Bundle\EasyAdminBundle\Field\MoneyField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextEditorField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class OrderCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Order::class;
    }

    
    public function configureFields(string $pageName): iterable
    {
        return [
            IdField::new('id')->hideOnForm(),
            AssociationField::new('user')->setDisabled(),
            TextField::new('reference'),
            DateField::new('created_at')->setLabel('Date de commande'),
            DateField::new('delivery_date')->setLabel('Date de livraison'),
            TextField::new('delivery_address')->setLabel('Adresse')->onlyOnIndex(),
            TextField::new('delivery_firstname')->setLabel('Prénom')->onlyOnIndex(),
            TextField::new('delivery_lastname')->setLabel('Nom')->onlyOnIndex(),
            MoneyField::new('TotalPrice')->setCurrency('EUR')->setLabel('Prix'),
            BooleanField::new('status'),
            CollectionField::new('orderDetails')
                ->hideOnIndex()
                ->setEntryType(OrderDetailsType::class)
                ->allowAdd()
                ->allowDelete()
                ->setFormTypeOptions([
                    'mapped' => true,
                    'required' => false,
                    'by_reference' => true
                ]),
        ];
    }
   
}
